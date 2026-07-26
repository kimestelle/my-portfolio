'use client';

import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useId,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './TextShimmer.module.css';
import {
  SHIMMER_PALETTE,
  SHIMMER_TILE_SIZE,
  sampleShimmerColor,
  sampleTileableShimmerMap,
  seedShimmerMap,
  type ShimmerColor,
} from './shimmerMap';

type ShimmerTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'li' | 'span';

type TextShimmerGroupProps = {
  children: ReactNode;
  seed?: string;
  palette?: readonly ShimmerColor[];
  tileSize?: number;
  durationMs?: number;
  noiseWindowMs?: number;
  tierGapMs?: number;
  playing?: boolean;
  onComplete?: () => void;
};

type ShimmerTextProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  as?: ShimmerTag;
  children: string;
  disabled?: boolean;
  priority?: number;
  style?: CSSProperties;
};

type TextShimmerContextValue = {
  seed: string;
  palette: readonly ShimmerColor[];
  tileSize: number;
  durationMs: number;
  noiseWindowMs: number;
  tierGapMs: number;
  playing: boolean;
};

type GlyphSpec = {
  grapheme: string;
  color: string;
  delayMs: number;
  animated: boolean;
};

const TextShimmerContext = createContext<TextShimmerContextValue | null>(null);

const TAG_PRIORITY: Record<ShimmerTag, number> = {
  h1: 0,
  h2: 1,
  h3: 2,
  h4: 3,
  h5: 4,
  h6: 5,
  p: 6,
  li: 6,
  span: 6,
};

function splitGraphemes(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
}

export function TextShimmerGroup({
  children,
  seed = 'estelle-portfolio',
  palette = SHIMMER_PALETTE,
  tileSize = SHIMMER_TILE_SIZE,
  durationMs = 900,
  noiseWindowMs = 260,
  tierGapMs = 55,
  playing = true,
  onComplete,
}: TextShimmerGroupProps) {
  const value = useMemo(() => ({
    seed,
    palette,
    tileSize,
    durationMs,
    noiseWindowMs,
    tierGapMs,
    playing,
  }), [
    durationMs,
    noiseWindowMs,
    palette,
    playing,
    seed,
    tierGapMs,
    tileSize,
  ]);

  useEffect(() => {
    if (!playing || !onComplete) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const maximumPriority = Math.max(...Object.values(TAG_PRIORITY));
    const timer = window.setTimeout(
      onComplete,
      durationMs + noiseWindowMs + maximumPriority * tierGapMs,
    );
    return () => window.clearTimeout(timer);
  }, [durationMs, noiseWindowMs, onComplete, playing, tierGapMs]);

  return (
    <TextShimmerContext.Provider value={value}>
      {children}
    </TextShimmerContext.Provider>
  );
}

export function ShimmerText({
  as = 'p',
  children,
  className,
  disabled = false,
  priority,
  style,
  ...props
}: ShimmerTextProps) {
  const context = useContext(TextShimmerContext);
  const id = useId();
  const Tag = as;
  const active = context !== null && !disabled;
  const resolvedPriority = priority ?? TAG_PRIORITY[as];
  const glyphMode = (
    (as === 'h1' || as === 'h2' || as === 'h3')
    && children.length <= 100
    && splitGraphemes(children).length <= 80
  );
  const paragraphMode = (
    (as === 'p' || as === 'li')
    && children.length > 48
  );
  const paragraphText = paragraphMode;
  // Approximate visual depth from text length without measuring layout.
  // The mask gets more time on longer copy, but color always settles on the
  // fixed shimmer clock; the cap keeps an essay from delaying indefinitely.
  const paragraphRevealDurationMs = context
    ? Math.min(
        context.durationMs + 700,
        context.durationMs + Math.max(0, children.length - 48) * 2.5,
      )
    : 0;

  const glyphs = useMemo<GlyphSpec[]>(() => {
    if (!context || !glyphMode) return [];

    const graphemes = splitGraphemes(children);
    const elementSeed = seedShimmerMap(`${context.seed}:${id}`);
    const sampled = graphemes.map((grapheme, index) => {
      if (/^\s+$/u.test(grapheme)) return null;
      const x = index * 8;
      const y = resolvedPriority * 31.3;
      const order = sampleTileableShimmerMap(
        x,
        y,
        elementSeed,
        context.tileSize,
      );
      return {
        order,
        color: sampleShimmerColor(
          sampleTileableShimmerMap(
            x + context.tileSize * 0.37,
            y + context.tileSize * 0.19,
            elementSeed,
            context.tileSize,
          ),
          context.palette,
        ),
      };
    });
    const activeSamples = sampled.filter(
      (sample): sample is NonNullable<typeof sample> => sample !== null,
    );
    const minimum = activeSamples.length
      ? Math.min(...activeSamples.map((sample) => sample.order))
      : 0;
    const maximum = activeSamples.length
      ? Math.max(...activeSamples.map((sample) => sample.order))
      : 1;
    const range = Math.max(0.00001, maximum - minimum);
    const tierDelay = resolvedPriority * context.tierGapMs;

    return graphemes.map((grapheme, index) => {
      const sample = sampled[index];
      if (!sample) {
        return { grapheme, color: 'inherit', delayMs: 0, animated: false };
      }
      return {
        grapheme,
        color: sample.color,
        delayMs:
          tierDelay
          + ((sample.order - minimum) / range) * context.noiseWindowMs,
        animated: true,
      };
    });
  }, [children, context, glyphMode, id, resolvedPriority]);

  const elementColors = useMemo(() => {
    if (!context || glyphMode) return null;
    const elementSeed = seedShimmerMap(`${context.seed}:${id}`);
    const y = resolvedPriority * 31.3;
    return {
      primary: sampleShimmerColor(
        sampleTileableShimmerMap(
          context.tileSize * 0.17,
          y,
          elementSeed,
          context.tileSize,
        ),
        context.palette,
      ),
      secondary: sampleShimmerColor(
        sampleTileableShimmerMap(
          context.tileSize * 0.73,
          y + context.tileSize * 0.31,
          elementSeed,
          context.tileSize,
        ),
        context.palette,
      ),
    };
  }, [context, glyphMode, id, resolvedPriority]);

  if (!active || !context) {
    return (
      <Tag {...props} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  if (!glyphMode) {
    return (
      <Tag
        {...props}
        className={`${styles.elementFade}${
          paragraphText ? ` ${styles.paragraphColor}` : ''
        }${
          paragraphMode ? ` ${styles.paragraphFade}` : ''
        }${className ? ` ${className}` : ''}`}
        style={{
          ...style,
          '--shimmer-color': elementColors?.primary ?? 'currentColor',
          '--shimmer-color-secondary':
            elementColors?.secondary ?? 'currentColor',
          '--shimmer-delay': `${resolvedPriority * context.tierGapMs}ms`,
          '--shimmer-duration': `${context.durationMs}ms`,
          '--paragraph-reveal-duration': `${paragraphRevealDurationMs}ms`,
          animationPlayState: context.playing ? 'running' : 'paused',
        } as CSSProperties}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      {...props}
      className={className}
      style={style}
    >
      {glyphs.map((glyph, index) => (
        glyph.animated ? (
          <span
            key={`${index}-${glyph.grapheme}`}
            className={styles.glyph}
            data-shimmer-glyph
            style={{
              '--shimmer-color': glyph.color,
              '--shimmer-delay': `${glyph.delayMs}ms`,
              '--shimmer-duration': `${context.durationMs}ms`,
              animationPlayState: context.playing ? 'running' : 'paused',
            } as CSSProperties}
          >
            {glyph.grapheme}
          </span>
        ) : (
          <Fragment key={`${index}-${glyph.grapheme}`}>
            {glyph.grapheme}
          </Fragment>
        )
      ))}
    </Tag>
  );
}
