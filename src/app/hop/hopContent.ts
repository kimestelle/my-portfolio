export const HOP_SIZE_OPTIONS = [
  { value: 'small', label: 'small Hoptimist' },
  { value: 'medium', label: 'medium Hoptimist' },
  { value: 'large', label: 'large Hoptimist' },
] as const;

export type SceneSize = (typeof HOP_SIZE_OPTIONS)[number]['value'];
export type PhotoFeedback = 'idle' | 'capturing' | 'saved';
export type IntroPhase = 'holding' | 'launching' | 'finished';

export type PerformanceStats = {
  fps: number;
  frameMs: number;
  drawCalls: number;
  triangles: number;
};

export const HOP_CONTENT = {
  metadata: {
    title: 'hop!',
    description: 'A spring-powered interactive Hoptimist study.',
  },
  canvasLabel: 'Interactive frosted-glass Hoptimist',
  intro: {
    title: 'hop',
    subtitle: 'inspired by',
    logoAlt: 'Hoptimist',
  },
  navigation: {
    label: 'Hop controls',
    portfolioLabel: 'portfolio',
    portfolioAriaLabel: 'Back to portfolio',
    title: 'hop',
    aboutAriaLabel: 'About Hop',
    sizeGroupLabel: 'Hoptimist size',
    openColorLabel: 'Open color pool',
    closeColorLabel: 'Close color pool',
  },
  about: {
    title: 'hop',
    body: 'A little companion for whenever you need a lift: good days, bad days, and all the ones in between.',
    closeLabel: 'Close about Hop',
    creditPrefix: 'inspired by',
    creditLogoAlt: 'Hoptimist',
  },
  photo: {
    ariaLabel: 'Save a photo of the current Hoptimist pose',
    idle: 'for photo',
    capturing: 'taking photo',
    saved: 'saved to downloads',
  },
  performance: {
    label: 'WebGL performance',
    hideHint: 'D to hide',
  },
  status: {
    loading: 'loading hoptimist',
    colorMode: 'pick it up and dip it into color',
    colorSelected: 'color selected',
    droppingIn: 'dropping in',
    settled: 'settled',
    loadingSpring: 'loading spring',
    hopping: 'hopping to target',
    plantingFeet: 'planting feet',
    landed: 'landed',
    pickedUp: 'picked up — release to drop',
    springReleased: 'spring released',
    pressingSpring: 'pressing spring',
    dropping: 'dropping',
    incompleteRig: 'rig data is incomplete',
    ready: 'tap to push · hold and drag to pick up',
    loadError: 'could not load hoptimist',
  },
} as const;
