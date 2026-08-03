import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { LabComponentId } from './labData';

const MoreBubbles = dynamic(() => import('./MoreBubbles'), {
  ssr: false,
  loading: () => null,
});

export const LAB_COMPONENTS: Record<LabComponentId, ComponentType> = {
  'more-bubbles': MoreBubbles,
};
