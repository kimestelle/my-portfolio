type ComposeHopPhotoOptions = {
  capturedAt: Date;
  source: HTMLCanvasElement;
};

export const HOP_PHOTO_WIDTH = 900;
export const HOP_PHOTO_HEIGHT = 1125;
export const HOP_PHOTO_ASPECT = HOP_PHOTO_WIDTH / HOP_PHOTO_HEIGHT;
export const HOP_PHOTO_RENDER_WIDTH = 1352;
export const HOP_PHOTO_RENDER_HEIGHT = 1690;

const clampByte = (value: number) => Math.min(255, Math.max(0, value));

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

function radialFalloff(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
) {
  const offsetX = (x - centerX) / radiusX;
  const offsetY = (y - centerY) / radiusY;
  const distance = Math.min(1, offsetX * offsetX + offsetY * offsetY);
  const amount = 1 - distance;
  return amount * amount;
}

function mixChannel(channel: number, color: number, amount: number) {
  return channel + (color - channel) * amount;
}

function interpolateGrid(
  values: Float32Array,
  topLeft: number,
  topRight: number,
  bottomLeft: number,
  bottomRight: number,
  xAmount: number,
  yAmount: number,
) {
  const top = values[topLeft] + (values[topRight] - values[topLeft]) * xAmount;
  const bottom = values[bottomLeft]
    + (values[bottomRight] - values[bottomLeft]) * xAmount;
  return top + (bottom - top) * yAmount;
}

function formatTimestamp(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => (
    parts.find((part) => part.type === type)?.value ?? ''
  );
  return value('month') + '.' + value('day') + '.' + value('year')
    + '  ' + value('hour') + ':' + value('minute') + ' ' + value('dayPeriod');
}

function drawPhotoStamp(
  context: CanvasRenderingContext2D,
  capturedAt: Date,
) {
  const inset = 22;
  const timestamp = formatTimestamp(capturedAt);
  const timestampY = HOP_PHOTO_HEIGHT - 39;
  const urlY = HOP_PHOTO_HEIGHT - inset;

  context.save();
  context.font = '400 14px "SFMono-Regular", Menlo, monospace';
  context.letterSpacing = '0.06em';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  context.fillStyle = 'rgba(8, 8, 8, 0.1)';
  context.shadowColor = 'rgba(8, 8, 8, 0.12)';
  context.shadowBlur = 0.65;
  context.fillText(
    timestamp,
    HOP_PHOTO_WIDTH - inset + 0.35,
    timestampY + 0.35,
  );
  context.shadowBlur = 0;
  context.fillStyle = 'rgba(8, 8, 8, 0.72)';
  context.fillText(timestamp, HOP_PHOTO_WIDTH - inset, timestampY);

  context.font = '400 11px "SFMono-Regular", Menlo, monospace';
  context.letterSpacing = '0.045em';
  context.fillStyle = 'rgba(8, 8, 8, 0.42)';
  context.fillText('estellekimdev.com/hop', HOP_PHOTO_WIDTH - inset, urlY);
  context.restore();
}

function processInstantFilm(
  context: CanvasRenderingContext2D,
  capturedAt: Date,
) {
  const width = HOP_PHOTO_WIDTH;
  const height = HOP_PHOTO_HEIGHT;
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;
  let randomState = capturedAt.getTime() >>> 0;
  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0;
    return randomState / 4294967296;
  };

  const coarseSize = 4;
  const coarseWidth = Math.ceil(width / coarseSize);
  const coarseHeight = Math.ceil(height / coarseSize);
  const coarseNoise = new Float32Array(coarseWidth * coarseHeight);
  for (let index = 0; index < coarseNoise.length; index += 1) {
    coarseNoise[index] = (random() + random() - 1) * 1.7;
  }

  const mottleSize = 68;
  const mottleWidth = Math.ceil(width / mottleSize) + 1;
  const mottleHeight = Math.ceil(height / mottleSize) + 1;
  const mottleDensity = new Float32Array(mottleWidth * mottleHeight);
  const mottleChroma = new Float32Array(mottleWidth * mottleHeight);
  for (let index = 0; index < mottleDensity.length; index += 1) {
    mottleDensity[index] = (random() + random() - 1) * 1.9;
    mottleChroma[index] = (random() + random() - 1) * 0.96;
  }

  const patchSize = 245;
  const patchWidth = Math.ceil(width / patchSize) + 1;
  const patchHeight = Math.ceil(height / patchSize) + 1;
  const iridescentPatchNoise = new Float32Array(patchWidth * patchHeight);
  for (let index = 0; index < iridescentPatchNoise.length; index += 1) {
    iridescentPatchNoise[index] = random() * 2 - 1;
  }

  const patchDetailSize = 72;
  const patchDetailWidth = Math.ceil(width / patchDetailSize) + 1;
  const patchDetailHeight = Math.ceil(height / patchDetailSize) + 1;
  const iridescentPatchDetail = new Float32Array(
    patchDetailWidth * patchDetailHeight,
  );
  for (let index = 0; index < iridescentPatchDetail.length; index += 1) {
    iridescentPatchDetail[index] = random() * 2 - 1;
  }

  for (let y = 0; y < height; y += 1) {
    const normalizedY = y / (height - 1) * 2 - 1;
    const mottleY = y / mottleSize;
    const mottleY0 = Math.floor(mottleY);
    const mottleYAmount = mottleY - mottleY0;
    const patchY = y / patchSize;
    const patchY0 = Math.floor(patchY);
    const patchYAmount = smoothstep(0, 1, patchY - patchY0);
    const patchDetailY = y / patchDetailSize;
    const patchDetailY0 = Math.floor(patchDetailY);
    const patchDetailYAmount = smoothstep(
      0,
      1,
      patchDetailY - patchDetailY0,
    );
    for (let x = 0; x < width; x += 1) {
      const normalizedX = x / (width - 1) * 2 - 1;
      const pixelIndex = (y * width + x) * 4;
      let red = pixels[pixelIndex];
      let green = pixels[pixelIndex + 1];
      let blue = pixels[pixelIndex + 2];
      const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;

      red = Math.min(253, Math.max(2, (red - 127.5) * 1.018 + 128.7));
      green = Math.min(253, Math.max(2, (green - 127.5) * 1.018 + 128.2));
      blue = Math.min(253, Math.max(2, (blue - 127.5) * 1.018 + 127.4));

      const highlight = smoothstep(0.74, 0.98, luminance);
      red += highlight * 0.8;
      green += highlight * 0.3;
      blue -= highlight * 0.35;

      const vignetteX = normalizedX;
      const vignetteY = (normalizedY + 0.12) * 0.82;
      const vignetteRadius = Math.sqrt(
        vignetteX * vignetteX + vignetteY * vignetteY,
      );
      const edgeAmount = smoothstep(0.52, 1.18, vignetteRadius);
      const vignetteAmount = smoothstep(0.72, 1.16, vignetteRadius);

      const cyan = radialFalloff(
        normalizedX,
        normalizedY,
        -0.82,
        -0.72,
        1.08,
        1.16,
      );
      const rose = radialFalloff(
        normalizedX,
        normalizedY,
        0.9,
        -0.02,
        1.08,
        1.28,
      );
      const amber = radialFalloff(
        normalizedX,
        normalizedY,
        -0.08,
        1.04,
        1.48,
        0.86,
      );
      const washGate = smoothstep(0.26, 0.94, vignetteRadius);
      const cyanMix = cyan * washGate * 0.043;
      const roseMix = rose * washGate * 0.035;
      const amberMix = amber * washGate * 0.028;

      red = mixChannel(red, 112, cyanMix);
      green = mixChannel(green, 226, cyanMix);
      blue = mixChannel(blue, 246, cyanMix);
      red = mixChannel(red, 244, roseMix);
      green = mixChannel(green, 150, roseMix);
      blue = mixChannel(blue, 218, roseMix);
      red = mixChannel(red, 250, amberMix);
      green = mixChannel(green, 220, amberMix);
      blue = mixChannel(blue, 132, amberMix);

      const patchX = x / patchSize;
      const patchX0 = Math.floor(patchX);
      const patchXAmount = smoothstep(0, 1, patchX - patchX0);
      const patchTopLeft = patchY0 * patchWidth + patchX0;
      const broadPatchValue = interpolateGrid(
        iridescentPatchNoise,
        patchTopLeft,
        patchTopLeft + 1,
        patchTopLeft + patchWidth,
        patchTopLeft + patchWidth + 1,
        patchXAmount,
        patchYAmount,
      );
      const patchDetailX = x / patchDetailSize;
      const patchDetailX0 = Math.floor(patchDetailX);
      const patchDetailXAmount = smoothstep(
        0,
        1,
        patchDetailX - patchDetailX0,
      );
      const patchDetailTopLeft = patchDetailY0 * patchDetailWidth
        + patchDetailX0;
      const detailPatchValue = interpolateGrid(
        iridescentPatchDetail,
        patchDetailTopLeft,
        patchDetailTopLeft + 1,
        patchDetailTopLeft + patchDetailWidth,
        patchDetailTopLeft + patchDetailWidth + 1,
        patchDetailXAmount,
        patchDetailYAmount,
      );
      const patchValue = broadPatchValue * 0.82
        + detailPatchValue * 0.27
        + Math.sin(
        normalizedX * 3.7
          + normalizedY * 2.35
          + (capturedAt.getTime() % 997) * 0.006,
      ) * 0.13;
      const patchMagnitude = Math.abs(patchValue);
      const patchBoundaryCore = 1 - smoothstep(0.025, 0.13, patchMagnitude);
      const patchBoundaryHalo = 1 - smoothstep(0.08, 0.3, patchMagnitude);
      const patchBoundary = patchBoundaryCore * 0.64
        + patchBoundaryHalo * 0.36;
      const patchBody = smoothstep(0.15, 0.72, patchMagnitude);
      const patchBoundaryMix = patchBoundary * (0.014 + edgeAmount * 0.11);
      const patchBodyMix = patchBody * (0.004 + edgeAmount * 0.014);
      const patchMix = patchBoundaryMix + patchBodyMix;
      const coolPatch = patchValue < 0 ? patchMix : patchMix * 0.16;
      const rosePatch = patchValue >= 0 ? patchMix : patchMix * 0.14;
      const lowerEdge = smoothstep(0.15, 1, normalizedY);
      const amberPatch = patchBoundaryMix * lowerEdge * 0.32;
      red = mixChannel(red, 142, coolPatch);
      green = mixChannel(green, 226, coolPatch);
      blue = mixChannel(blue, 246, coolPatch);
      red = mixChannel(red, 244, rosePatch);
      green = mixChannel(green, 158, rosePatch);
      blue = mixChannel(blue, 224, rosePatch);
      red = mixChannel(red, 250, amberPatch);
      green = mixChannel(green, 220, amberPatch);
      blue = mixChannel(blue, 144, amberPatch);

      const vignetteDensity = vignetteAmount * 0.082;
      red *= 1 - vignetteDensity;
      green *= 1 - vignetteDensity;
      blue *= 1 - vignetteDensity;

      const midtoneWeight = 0.44 + 0.7 * Math.sin(Math.PI * luminance);
      const grainEdgeBoost = 1
        + edgeAmount * 0.96
        + patchBoundary * edgeAmount * 0.22;
      const luminanceNoise = (random() + random() - 1)
        * 5.9
        * midtoneWeight
        * grainEdgeBoost;
      const chromaNoise = (random() + random() - 1)
        * 1.08
        * midtoneWeight
        * grainEdgeBoost;
      const coarseIndex = Math.floor(y / coarseSize) * coarseWidth
        + Math.floor(x / coarseSize);
      const densityNoise = coarseNoise[coarseIndex]
        * (0.88 + edgeAmount * 0.72);
      const mottleX = x / mottleSize;
      const mottleX0 = Math.floor(mottleX);
      const mottleXAmount = mottleX - mottleX0;
      const mottleTopLeft = mottleY0 * mottleWidth + mottleX0;
      const mottleTopRight = mottleTopLeft + 1;
      const mottleBottomLeft = mottleTopLeft + mottleWidth;
      const mottleBottomRight = mottleBottomLeft + 1;
      const developmentDensity = interpolateGrid(
        mottleDensity,
        mottleTopLeft,
        mottleTopRight,
        mottleBottomLeft,
        mottleBottomRight,
        mottleXAmount,
        mottleYAmount,
      ) * (0.94 + edgeAmount * 0.62);
      const developmentChroma = interpolateGrid(
        mottleChroma,
        mottleTopLeft,
        mottleTopRight,
        mottleBottomLeft,
        mottleBottomRight,
        mottleXAmount,
        mottleYAmount,
      ) * (0.44 + edgeAmount * 0.7);
      let silverSpeck = 0;
      if (random() > 0.99972) {
        silverSpeck = (random() > 0.55 ? 1 : -1) * (5 + random() * 11);
      }

      pixels[pixelIndex] = clampByte(
        red
          + luminanceNoise
          + chromaNoise
          + densityNoise
          + developmentDensity
          + developmentChroma * 0.5
          + silverSpeck,
      );
      pixels[pixelIndex + 1] = clampByte(
        green
          + luminanceNoise
          - chromaNoise * 0.35
          + densityNoise
          + developmentDensity
          - developmentChroma * 0.28
          + silverSpeck,
      );
      pixels[pixelIndex + 2] = clampByte(
        blue
          + luminanceNoise
          - chromaNoise * 0.65
          + densityNoise
          + developmentDensity
          + developmentChroma * 0.42
          + silverSpeck,
      );
    }
  }

  context.putImageData(frame, 0, 0);
}

export function composeHopPhoto({
  capturedAt,
  source,
}: ComposeHopPhotoOptions) {
  const photo = document.createElement('canvas');
  photo.width = HOP_PHOTO_WIDTH;
  photo.height = HOP_PHOTO_HEIGHT;
  const context = photo.getContext('2d');
  if (!context) return source;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.filter = 'contrast(1.012) saturate(1.03)';
  context.drawImage(
    source,
    0,
    0,
    source.width,
    source.height,
    0,
    0,
    HOP_PHOTO_WIDTH,
    HOP_PHOTO_HEIGHT,
  );
  context.filter = 'none';
  processInstantFilm(context, capturedAt);

  context.strokeStyle = 'rgba(15, 15, 15, 0.045)';
  context.lineWidth = 1;
  context.strokeRect(0.5, 0.5, HOP_PHOTO_WIDTH - 1, HOP_PHOTO_HEIGHT - 1);
  drawPhotoStamp(context, capturedAt);

  return photo;
}
