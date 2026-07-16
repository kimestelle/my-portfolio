import { execFile } from 'node:child_process';
import { File } from 'node:buffer';
import { mkdtemp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fal } from '@fal-ai/client';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const INPUT_DIRECTORY = path.join(ROOT, 'public/creative-images/dreamlike');
const OUTPUT_DIRECTORY = path.join(INPUT_DIRECTORY, 'optimized');
const PREVIEW_DIRECTORY = path.join(OUTPUT_DIRECTORY, 'preview');
const PHOTO_MODULE = path.join(ROOT, 'src/app/playground/components/dreamlikePhotos.generated.ts');
const TARGET_RESOLUTION = '2160p';
const OUTPUT_SIZE = 2160;
const OUTPUT_QUALITY = 86;
const PREVIEW_SIZE = 768;
const PREVIEW_QUALITY = 76;
const DEFAULT_CONCURRENCY = 2;

const optionValue = (name) => {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
};

const force = process.argv.includes('--force');
const limit = Number(optionValue('limit') ?? Number.POSITIVE_INFINITY);
const concurrency = Math.max(1, Number(optionValue('concurrency') ?? DEFAULT_CONCURRENCY));

if (!process.env.FAL_KEY) {
  throw new Error('FAL_KEY is missing. Add it to .env.local before running this pipeline.');
}

fal.config({ credentials: process.env.FAL_KEY });

async function decodeHeic(sourcePath, temporaryDirectory) {
  const outputName = `${path.basename(sourcePath)}.png`;
  const decodedPath = path.join(temporaryDirectory, outputName);

  // These iPhone HEICs include auxiliary HDR/depth images that exceed
  // libheif's reference cap. Quick Look uses macOS ImageIO and extracts the
  // primary image at its native dimensions without flattening through JPEG.
  await execFileAsync('qlmanage', [
    '-t',
    '-s',
    '8192',
    '-o',
    temporaryDirectory,
    sourcePath,
  ]);

  return decodedPath;
}

async function convertSourceToWebp(sourcePath, temporaryDirectory) {
  const decodedPath = await decodeHeic(sourcePath, temporaryDirectory);
  return sharp(decodedPath)
    .rotate()
    .webp({ quality: 94, effort: 5, smartSubsample: true })
    .toBuffer();
}

async function upscaleWithFal(sourceWebp, sourceName) {
  const upload = new File([sourceWebp], `${sourceName}.webp`, { type: 'image/webp' });
  const imageUrl = await fal.storage.upload(upload);
  const result = await fal.subscribe('fal-ai/seedvr/upscale/image', {
    input: {
      image_url: imageUrl,
      upscale_mode: 'target',
      target_resolution: TARGET_RESOLUTION,
      noise_scale: 0.06,
      output_format: 'webp',
    },
  });

  const response = await fetch(result.data.image.url);
  if (!response.ok) {
    throw new Error(`Could not download fal output (${response.status} ${response.statusText})`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function normalizeOutput(upscaledWebp, outputPath) {
  await sharp(upscaledWebp)
    .rotate()
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
      fit: 'cover',
      position: 'attention',
    })
    .webp({ quality: OUTPUT_QUALITY, effort: 6, smartSubsample: true })
    .toFile(outputPath);
}

async function processPhoto(entry, total) {
  const outputName = `dreamlike-${String(entry.index + 1).padStart(2, '0')}.webp`;
  const outputPath = path.join(OUTPUT_DIRECTORY, outputName);

  if (!force) {
    try {
      const metadata = await sharp(outputPath).metadata();
      if (metadata.width === OUTPUT_SIZE && metadata.height === OUTPUT_SIZE) {
        console.log(`[${entry.index + 1}/${total}] skip ${entry.fileName}`);
        return;
      }
    } catch {
      // Missing or incomplete output: process it below.
    }
  }

  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'dreamlike-'));
  try {
    console.log(`[${entry.index + 1}/${total}] convert ${entry.fileName}`);
    const sourceWebp = await convertSourceToWebp(entry.sourcePath, temporaryDirectory);
    console.log(`[${entry.index + 1}/${total}] upscale ${entry.fileName}`);
    const upscaledWebp = await upscaleWithFal(sourceWebp, path.parse(entry.fileName).name);
    await normalizeOutput(upscaledWebp, outputPath);
    console.log(`[${entry.index + 1}/${total}] wrote ${outputName}`);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

async function runWorkers(entries) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, entries.length) }, async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor];
      cursor += 1;
      await processPhoto(entry, entries.length);
    }
  });
  await Promise.all(workers);
}

async function createPreviewTextures(outputNames) {
  await mkdir(PREVIEW_DIRECTORY, { recursive: true });
  for (const outputName of outputNames) {
    const previewPath = path.join(PREVIEW_DIRECTORY, outputName);
    try {
      const metadata = await sharp(previewPath).metadata();
      if (metadata.width === PREVIEW_SIZE && metadata.height === PREVIEW_SIZE) continue;
    } catch {
      // Missing or incomplete preview: generate it below.
    }
    await sharp(path.join(OUTPUT_DIRECTORY, outputName))
      .resize(PREVIEW_SIZE, PREVIEW_SIZE, { fit: 'cover' })
      .webp({ quality: PREVIEW_QUALITY, effort: 6, smartSubsample: true })
      .toFile(previewPath);
  }
}

async function writePhotoModule() {
  const outputNames = (await readdir(OUTPUT_DIRECTORY))
    .filter((fileName) => /^dreamlike-\d{2}\.webp$/.test(fileName))
    .sort((first, second) => first.localeCompare(second, 'en', { numeric: true }));
  await createPreviewTextures(outputNames);
  const fullResolutionPaths = outputNames.map(
    (fileName) => `  '/creative-images/dreamlike/optimized/${fileName}',`,
  );
  const previewPaths = outputNames.map(
    (fileName) => `  '/creative-images/dreamlike/optimized/preview/${fileName}',`,
  );
  const contents = [
    '// Generated by npm run dreamlike:process. Do not edit by hand.',
    'export const DREAMLIKE_PHOTOS = [',
    ...fullResolutionPaths,
    '] as const;',
    '',
    'export const DREAMLIKE_PREVIEWS = [',
    ...previewPaths,
    '] as const;',
    '',
  ].join('\n');
  await writeFile(PHOTO_MODULE, contents);
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
const sourceNames = (await readdir(INPUT_DIRECTORY))
  .filter((fileName) => /\.heic$/i.test(fileName))
  .sort((first, second) => first.localeCompare(second, 'en', { numeric: true }));
const selectedNames = sourceNames.slice(0, Number.isFinite(limit) ? limit : sourceNames.length);
const entries = selectedNames.map((fileName, index) => ({
  index,
  fileName,
  sourcePath: path.join(INPUT_DIRECTORY, fileName),
}));

console.log(`Processing ${entries.length} dreamlike photos at ${OUTPUT_SIZE}x${OUTPUT_SIZE}.`);
await runWorkers(entries);
await writePhotoModule();
console.log('Dreamlike photo pipeline complete.');
