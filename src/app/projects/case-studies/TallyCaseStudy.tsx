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
  ['system', 'design system'],
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
          eyebrow="mobile UI design"
          title="tally"
          deck="Mobile habit app where a contract connects the habit, proof, an accountability partner, and money at stake. I designed the full product and its design system."
          meta={[]}
          links={[]}
          breadcrumbRoot={{ href: '/projects', label: 'selected work' }}
          hideBreadcrumb={inline}
        />

        <p className={styles.consentNote} role="note">
          All files shown in this case study are shared with consent from
          Tally&apos;s founder.
        </p>

        <FieldNoteProjectSummary
          facts={[
            ['role', 'mobile UI designer'],
            ['timeline', 'spring 2026'],
            ['team', 'Tally founders'],
            ['outcome', '10 requested flows → full app structure + design system'],
          ]}
          keyDetails={[
            'mapped one contract from setup through proof, review, and payout',
            'designed setup, photo and Screen Time proof, partner approval, and stakes',
            'prototyped wallet, profile, friends, feed, notifications, and settings',
            'built the visual system and reusable controls, cards, navigation, and modals',
            'covered permission, waiting, failure, dispute, retry, and recovery states',
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
              The brief started with ten flows. As the product grew, setup,
              proof, partners, money, and account settings were being treated
              as separate features. I mapped them around one object: a
              contract moving from draft to payout.
            </p>

            <p>
              Every contract records the habit, schedule, proof method,
              reviewer, stake, and result. New screens had to read or change
              one of those parts.
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
                states, design system, and mobile UI in Figma, then reviewed
                the working app in TestFlight. I did not build the app. Tally
                already used burgundy and cream when I joined.
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
              A contract needs a habit, schedule, proof method, reviewer, and
              stake. Putting all five decisions on one screen made setup feel
              like paperwork.
            </p>

            <p>
              I split setup into short steps, then showed the full terms before
              activation. Proof and money stay visible at the point where they
              can still be changed.
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
              Contracts could not work alone. People needed to fund stakes,
              see where money moved, manage reviewers, and change permissions
              later.
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
              Funding and one-time authorization decide whether a contract can
              start. Profiles and friends show who can review proof. The feed
              holds requests and outcomes. Settings hold the permissions and
              notifications used by the main flow.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="03"
            id="system"
            title="design system"
            className={styles.section}
          >
            <p className={styles.lead}>
              I built the design system alongside the flows so recurring
              actions and states did not have to be redrawn screen by screen.
            </p>

            <div className={styles.surfaceRoles} aria-label="Tally design system scope">
              <div>
                <span>foundations</span>
                <strong>type scale, color roles, texture, and elevation</strong>
              </div>
              <div>
                <span>navigation and actions</span>
                <strong>tab bar, buttons, selection, and loading states</strong>
              </div>
              <div>
                <span>inputs and status</span>
                <strong>fields, labels, timers, icons, and contract states</strong>
              </div>
              <div>
                <span>product patterns</span>
                <strong>cards, informational modals, confirmation, and errors</strong>
              </div>
            </div>

            <FieldNoteFigure
              src="/project-images/tally/design-system.png"
              alt="Tally design system board covering identity, typography, color, navigation, actions, selection controls, labels, inputs, cards, icons, and modal patterns"
              width={1800}
              height={1256}
              caption="the working system covered foundations, reusable controls, product states, and modal patterns."
              imageClassName={styles.darkBoard}
              sizes="(max-width: 767px) 100vw, 70rem"
            />

            <p>
              The same hierarchy carries from routine actions into funding
              permission, failed proof, confirmation, and error states. Those
              higher-risk moments use repeatable patterns instead of one-off
              screens.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="04"
            id="states"
            title="proof and contract states"
            className={styles.section}
          >
            <p className={styles.lead}>
              Tally handles money, privacy, and device permissions. I designed
              explicit states and language for one-time funding authorization,
              Screen Time access, failed proof, partner disagreement, manual
              review, and recovery.
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
              Photo and Screen Time use different inputs, then enter the same
              contract states. The interface always says whether proof counted,
              who can review it, and whether the stake changed.
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
            number="05"
            id="reviews"
            title="implementation review"
            className={styles.section}
          >
            <p className={styles.lead}>
              Reviewing Figma against TestFlight exposed missing navigation,
              incomplete state changes, and screens with no clear place in the
              app.
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
              I kept open questions in Figma and reviewed unfinished structure
              early. That stopped me from polishing flows before their place in
              the app was clear.
            </p>
          </FieldNoteSection>

          <FieldNoteSection
            number="06"
            id="retrospective"
            title="retrospective"
            className={styles.section}
          >
            <p className={styles.lead}>
              I would keep the contract model and simplify the visual hierarchy
              around it.
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
                  The informational modals and permission screens already cover
                  one-time funding authorization, Screen Time, privacy, failed
                  proof, and manual review. I would test whether the language is
                  understood before changing the state model.
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
              finished until someone could predict what happens to their proof,
              reviewer, and money at each step.
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
