import type { ComponentType } from 'react';
import MoreBubbles from './MoreBubbles';
import type { LabComponentId } from './labData';

export const LAB_COMPONENTS: Record<LabComponentId, ComponentType> = {
  'more-bubbles': MoreBubbles,
};
