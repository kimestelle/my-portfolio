import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { marked } from 'marked';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import ProcessControls from './ProcessControls';
import styles from './process.module.css';

export const metadata: Metadata = {
  title: 'how I build 0 → 1 — Estelle Kim',
  description:
    'How I turn an idea into working software, from the first question to the final checks.',
};

export default async function ProcessPage() {
  const markdownPath = path.join(
    process.cwd(),
    'public/process/estelle-authorship-system.md'
  );
  const markdown = await readFile(markdownPath, 'utf8');
  const rendered = await marked.parse(markdown, { gfm: true });

  return (
    <main className="responsive-padding w-full">
      <div className="page-frame-reading flex flex-col gap-8">
        <nav className="type-meta flex items-center justify-between gap-4">
          <Link
            href="/about"
            className="text-[color:var(--text-secondary)] underline decoration-black/20 underline-offset-4"
          >
            ← about
          </Link>
          <ShimmerText as="span">last updated · August 2026</ShimmerText>
        </nav>

        <ProcessControls />

        <article
          id="authorship-system"
          className={styles.document}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    </main>
  );
}
