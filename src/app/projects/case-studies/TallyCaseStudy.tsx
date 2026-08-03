import Image from 'next/image';
import {
  FieldNoteDetail,
  FieldNoteFigure,
  FieldNoteHeader,
  FieldNoteProjectSummary,
  FieldNoteReader,
  FieldNoteSection,
} from '../../field-notes/components/FieldNotePrimitives';
import FieldNoteScrollLink from '../../field-notes/components/FieldNoteScrollLink';
import styles from './tally-case-study.module.css';

const mapEntries = [
  ['model', 'contract model'],
  ['setup', 'contract setup'],
  ['surfaces', 'wallet, profile, and settings'],
  ['states', 'proof and contract states'],
  ['reviews', 'implementation review'],
  ['retrospective', 'retrospective', 'retrospective'],
] as const;

const contractLoop = [
  ['start', 'habit and schedule'],
  ['terms', 'completion requirements'],
  ['proof', 'verification method'],
  ['review', 'review authority'],
  ['result', 'proof and payout outcome'],
] as const;

const proofStates = [
  {
    src: '/project-images/tally/verification-failed.png',
    alt: 'Tally photo verification failure screen with a retry path',
    label: 'verification failed',
    note: 'show the failure reason and allow retry',
  },
  {
    src: '/project-images/tally/verification-success.png',
    alt: 'Tally successful photo verification screen',
    label: 'verification passed',
    note: 'confirm completion and return to the contract',
  },
  {
    src: '/project-images/tally/manual-review.png',
    alt: 'Tally screen for reporting a missed habit',
    label: 'habit missed',
    note: 'record the miss before the payout changes',
  },
] as const;

const contractStates = [
  ['draft', 'editable'],
  ['pending', 'awaiting proof or approval'],
  ['active', 'accepting scheduled proof'],
  ['verified', 'current requirement complete'],
  ['paused', 'state changes suspended'],
  ['inactive', 'ended or not started'],
] as const;

const demoMoments = [
  {
    number: '01',
    label: 'choose proof method',
    note: 'pick photo or Screen Time before asking for anything else',
    src: '/project-images/tally/demo/choose-and-configure.m4v',
    poster: '/project-images/tally/demo/configure.png',
  },
  {
    number: '02',
    label: 'set stake',
    note: 'move the amount while the consequence is still editable',
    src: '/project-images/tally/demo/set-the-stakes.m4v',
    poster: '/project-images/tally/demo/personalized.png',
  },
  {
    number: '03',
    label: 'personalize and activate',
    note: 'add a background, activate it, and come back to a real status',
    src: '/project-images/tally/demo/personalize-and-activate.m4v',
    poster: '/project-images/tally/demo/contract-ready.png',
  },
] as const;

const heroFlowScreens = [
  {
    src: '/project-images/tally/demo/choose.png',
    alt: 'Choose photo verification or Screen Time tracking',
    label: 'choose proof',
  },
  {
    src: '/project-images/tally/demo/configure.png',
    alt: 'Configure the contract name, frequency, and accountability',
    label: 'set terms',
  },
  {
    src: '/project-images/tally/demo/stake.png',
    alt: 'Choose how much money is at stake',
    label: 'set stake',
  },
  {
    src: '/project-images/tally/demo/personalized.png',
    alt: 'Personalize the contract card with a background image',
    label: 'personalize',
  },
  {
    src: '/project-images/tally/demo/contract-ready.png',
    alt: 'The new contract shown in the all contracts list',
    label: 'contract ready',
  },
] as const;

const reviewChanges = [
  [
    'one feed doing everything',
    'home for what needs attention, account for history, feed for people',
  ],
  [
    'an open-ended card editor',
    'a smaller set of backgrounds, proof images, and card treatments',
  ],
  [
    'a clean success path',
    'empty, upcoming, failed, disputed, pending, and manual-review states',
  ],
] as const;

export default function TallyCaseStudy({
  inline = false,
}: {
  inline?: boolean;
}) {
  const Root = inline ? 'div' : 'main';

  return (
    <Root
      className={`${inline ? 'project-case-study-inline-content' : 'responsive-padding'} case-study-reading-scope ${styles.page}`}
    >
      <article className={inline ? undefined : 'page-frame-wide'}>
        <FieldNoteHeader
          eyebrow="product design"
          title="tally"
          deck="a mobile habit-contract product covering setup, proof, stakes, wallet activity, social accountability, and account management."
          meta={[]}
          links={[]}
          breadcrumbRoot={{ href: '/projects', label: 'selected work' }}
          hideBreadcrumb={inline}
        />

        <FieldNoteProjectSummary
          facts={[
            ['role', 'product designer'],
            ['timeline', 'spring 2026'],
            ['team', 'founder team'],
            ['outcome', '10 starting flows → full product structure'],
          ]}
          keyDetails={[
            'mapped the full flow from choosing a habit through proof and payout',
            'designed contract setup, partner approval, and money-at-stake decisions',
            'prototyped wallet, funding, profile, friends, feed, notifications, and settings',
            'gave photo and Screen Time proof the same submission and review states',
            'covered waiting, failure, dispute, retry, recovery, and empty states',
          ]}
        />

        <figure className={styles.heroFigure}>
          <div className={`${styles.heroFlow} media-clip-surface`}>
            {heroFlowScreens.map((screen, index) => (
              <figure className={styles.heroFlowStep} key={screen.label}>
                <div className={styles.heroFlowFrame}>
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    fill
                    priority={index < 2}
                    sizes="(max-width: 720px) 8rem, 11rem"
                  />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {screen.label}
                </figcaption>
              </figure>
            ))}
          </div>
          <figcaption>
            the working flow from choosing proof to seeing the contract in the
            app.
          </figcaption>
        </figure>

        <FieldNoteReader mapLabel="sections" entries={mapEntries}>
          <FieldNoteSection
            number="00"
            id="model"
            title="contract model"
            className={styles.section}
          >
            <p className={styles.lead}>
              The brief started with ten flows, then expanded to photo and
              Screen Time proof, accountability partners, stakes, wallet
              funding and history, profiles, friends, feed, notifications,
              settings, and activity states.
            </p>

            <p>
              I stopped designing one flow at a time and mapped a single
              contract from “i want to do this” to “it counted” or “it
              didn&apos;t.” New ideas had to fit somewhere on that path.
            </p>

            <div className={styles.contractLoop} aria-label="Tally contract lifecycle">
              {contractLoop.map(([name, question], index) => (
                <div className={styles.loopStep} key={name}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{name}</strong>
                  <small>{question}</small>
                </div>
              ))}
            </div>

            <FieldNoteDetail label="role and scope">
              <p>
                I turned the founders&apos; brief into the app structure, flows,
                states, and mobile UI in Figma, then revised it against the
                working app. I did not build the app. The burgundy and cream
                palette was already part of Tally when I joined.
              </p>
            </FieldNoteDetail>
          </FieldNoteSection>

          <FieldNoteSection
            number="01"
            id="setup"
            title="contract setup"
            className={styles.section}
          >
            <p className={styles.lead}>
              Contract setup combines the habit, schedule, proof method,
              reviewer, and stake. Putting every decision on one screen made
              setup feel like paperwork.
            </p>

            <p>
              I split setup into small decisions and saved the complete
              contract for the final review. The person moves quickly, but the
              money and proof are never hidden from them.
            </p>

            <div className={styles.demoStrip} aria-label="Tally app demonstration sequence">
              {demoMoments.map((moment) => (
                <figure key={moment.number}>
                  <div className={`${styles.demoPhone} media-clip-surface`}>
                    <video
                      src={moment.src}
                      poster={moment.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`${moment.label} demonstration`}
                    />
                  </div>
                  <figcaption>
                    <span>{moment.number}</span>
                    <strong>{moment.label}</strong>
                    <p>{moment.note}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </FieldNoteSection>

          <FieldNoteSection
            number="02"
            id="surfaces"
            title="wallet, profile, and settings"
            className={styles.section}
          >
            <p className={styles.lead}>
              The contract flow depended on the rest of the product. People
              needed to fund stakes, understand where money moved, manage
              accountability partners, and change permissions later.
            </p>

            <div className={styles.surfaceRoles} aria-label="Tally product surfaces">
              <div>
                <span>wallet</span>
                <strong>balance, funding, cash out, and transaction history</strong>
              </div>
              <div>
                <span>profile and friends</span>
                <strong>contract history, success rate, and accountability network</strong>
              </div>
              <div>
                <span>feed</span>
                <strong>requests, proof review, and contract outcomes</strong>
              </div>
              <div>
                <span>settings</span>
                <strong>account, notifications, Screen Time, and privacy</strong>
              </div>
            </div>

            <div className={styles.surfaceEvidence}>
              <FieldNoteFigure
                src="/project-images/tally/wallet-account.png"
                alt="Tally wallet balance, funding, transaction history, account, profile, and friends prototypes"
                width={1800}
                height={1543}
                caption="wallet funding and history, profiles, and accountability partners."
                imageClassName={styles.darkBoard}
                sizes="(max-width: 767px) 100vw, 34rem"
              />
              <FieldNoteFigure
                src="/project-images/tally/feed-settings.png"
                alt="Tally feed, account settings, notification preferences, Screen Time permissions, and privacy prototypes"
                width={1800}
                height={1543}
                caption="activity feed, account settings, notifications, Screen Time, and privacy."
                imageClassName={styles.darkBoard}
                sizes="(max-width: 767px) 100vw, 34rem"
              />
            </div>

            <p>
              These were not secondary screens. Funding and one-time
              authorization determine whether a contract can start. Profiles,
              friends, and the feed explain who can review progress. Settings
              contain the permissions and notification controls the main flow
              relies on.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="03"
            id="states"
            title="proof and contract states"
            className={styles.section}
          >
            <p className={styles.lead}>
              I designed the states outside the success path: failed proof,
              partner disagreement, contracts that had not started, missed
              habits, manual review, and recovery.
            </p>

            <div className={styles.proofGrid}>
              {proofStates.map((state) => (
                <figure key={state.label}>
                  <div className={`${styles.proofImage} media-clip-surface`}>
                    <Image
                      src={state.src}
                      alt={state.alt}
                      width={402}
                      height={874}
                      sizes="(max-width: 720px) 78vw, 16rem"
                    />
                  </div>
                  <figcaption>
                    <strong>{state.label}</strong>
                    <span>{state.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p>
              Photo proof and Screen Time need different setup, but after that
              they should speak the same language. A person should not have to
              guess whether their proof counted or whether money moved.
            </p>

            <div className={styles.stateLegend}>
              {contractStates.map(([name, description]) => (
                <div key={name}>
                  <span>{name}</span>
                  <p>{description}</p>
                </div>
              ))}
            </div>

            <div className={styles.handoffStudy}>
              <figure className={styles.workingAppFigure}>
                <div className={`${styles.workingAppFrame} media-clip-surface`}>
                  <Image
                    src="/project-images/tally/demo/contract-ready.png"
                    alt="Implemented Tally contract card waiting for wallet funding"
                    width={831}
                    height={1800}
                    sizes="(max-width: 720px) 76vw, 16rem"
                  />
                </div>
                <figcaption>
                  <strong>implemented state</strong>
                  <span>funding required before activation</span>
                </figcaption>
              </figure>

              <figure className={styles.stateSystemFigure}>
                <div className={`${styles.stateSystemImage} media-clip-surface`}>
                  <Image
                    src="/project-images/tally/habit-mini-states.png"
                    alt="Tally habit cards in pending, active, verified, paused, and inactive states"
                    width={1178}
                    height={622}
                    sizes="(max-width: 767px) 100vw, 38rem"
                  />
                </div>
                <figcaption>
                  <strong>Figma state system</strong>
                  <span>pending, active, verified, paused, and inactive variants</span>
                </figcaption>
              </figure>
            </div>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="reviews"
            title="implementation review"
            className={styles.section}
          >
            <p className={styles.lead}>
              Figma and TestFlight reviews exposed missing navigation,
              incomplete state transitions, and screens that had no clear
              place in the app.
            </p>

            <div className={styles.briefTranslation} aria-label="Changes made during review">
              {reviewChanges.map(([before, after]) => (
                <div key={before}>
                  <div>
                    <span>started with</span>
                    <strong>{before}</strong>
                  </div>
                  <div>
                    <span>changed to</span>
                    <p>{after}</p>
                  </div>
                </div>
              ))}
            </div>

            <FieldNoteFigure
              src="/project-images/tally/setup-iterations.jpg"
              alt="Tally Figma iterations exploring type, contract selection, setup, funding permission, and loading states"
              width={1800}
              height={2176}
              caption="type, hierarchy, contract setup, authorization, and loading-state iterations from the working file."
              className={styles.iterationBoardFigure}
              imageClassName={styles.figmaCrop}
              sizes="(max-width: 767px) 100vw, 70rem"
            />

            <FieldNoteFigure
              src="/project-images/tally/app-structure.png"
              alt="Tally app map connecting home, account, feed, modal, and component screens"
              width={1600}
              height={621}
              caption="by the end, the map included the boring screens too: permissions, empty states, receipts, errors, and account settings."
              className={styles.architectureFigure}
              imageClassName={styles.figmaCrop}
              sizes="(max-width: 767px) 100vw, 70rem"
            />

            <p>
              I left open questions directly in Figma and shared unfinished
              structure early. That made reviews messier, but it also stopped
              me from polishing the wrong thing for very long.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="05"
            id="retrospective"
            title="retrospective"
            className={styles.section}
          >
            <p className={styles.lead}>
              The contract lifecycle is the strongest part of the work. The
              next pass should simplify visual hierarchy without changing that
              state model.
            </p>

            <div className={styles.retrospectiveGrid}>
              <div>
                <span>visual hierarchy</span>
                <p>
                  The burgundy looks nice, but primary actions and contract
                  status still disappear inside some dense screens.
                </p>
              </div>
              <div>
                <span>risk and permission states</span>
                <p>
                  I designed informational modals and permission screens for
                  one-time funding authorization, Screen Time, privacy,
                  failed proof, and manual review.
                </p>
              </div>
              <div>
                <span>task-based usability testing</span>
                <p>
                  I would stop adding screens and see where someone hesitates,
                  skips the review, or predicts the wrong outcome.
                </p>
              </div>
            </div>

            <p>
              I would keep the one-contract model. I would not call the rest
              finished until someone could walk through a contract and tell me
              what they thought would happen next.
            </p>
          </FieldNoteSection>

          <div className={styles.endMatter}>
            <FieldNoteScrollLink href="#model">back to top ↑</FieldNoteScrollLink>
          </div>
        </FieldNoteReader>
      </article>
    </Root>
  );
}
