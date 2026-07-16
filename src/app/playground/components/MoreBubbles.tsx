'use client';

import BubblePrototype from './BubblePrototype';
import { DREAMLIKE_PHOTOS, DREAMLIKE_PREVIEWS } from './dreamlikePhotos.generated';

export const MORE_BUBBLE_PHOTOS = DREAMLIKE_PHOTOS;

const LARGE_BUBBLE_RADIUS_RANGE = [0.11, 0.245] as const;

export default function MoreBubbles() {
  return (
    <BubblePrototype
      photoSources={MORE_BUBBLE_PHOTOS}
      photoPreviewSources={DREAMLIKE_PREVIEWS}
      radiusRange={LARGE_BUBBLE_RADIUS_RANGE}
      initialBubbleCount={7}
      maxBubbleCount={7}
      randomizeMediaOrder
      initialBackgroundSource={DREAMLIKE_PHOTOS[28]}
      initialBackgroundPreviewSource={DREAMLIKE_PREVIEWS[28]}
      interactionLabel="Click the field to release a photo bubble; hover to deform it and click it to burst"
    />
  );
}
