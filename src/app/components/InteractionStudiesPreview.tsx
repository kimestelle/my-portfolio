import { INTERACTION_STUDIES } from '../playground/components/studyData';
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';
import InteractionGrid from './InteractionGrid';
import styles from './interaction-studies-preview.module.css';

export default function InteractionStudiesPreview() {
  return (
    <section className={styles.section} aria-labelledby="interaction-snippets-heading">
      <div className={styles.header}>
        <div className="star-line-section shrink-0">
          <span className="star-glyph-section" aria-hidden="true">✦</span>
          <ShimmerText as="h3" className="star-copy-section" id="interaction-snippets-heading">
            interaction snippets
          </ShimmerText>
        </div>
        <span className={styles.line} />
      </div>

      <InteractionGrid studies={INTERACTION_STUDIES} />
    </section>
  );
}
