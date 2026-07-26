'use client';

import dynamic from 'next/dynamic';
import type { LazyVideoProps } from './LazyVideo';

export const preloadLazyVideo = () => import('./LazyVideo');

const DeferredLazyVideo = dynamic<LazyVideoProps>(preloadLazyVideo, {
  ssr: false,
});

export default DeferredLazyVideo;
