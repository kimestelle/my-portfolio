'use client';

export default function ProcessControls() {
  const setAll = (open: boolean) => {
    document
      .querySelectorAll<HTMLDetailsElement>(
        '#authorship-system details.process-section'
      )
      .forEach((section) => {
        section.open = open;
      });
  };

  return (
    <div className="flex flex-wrap gap-2" aria-label="Document controls">
      <button
        type="button"
        onClick={() => setAll(true)}
        className="glass-interactive ui-radius-control type-meta px-3 py-2"
      >
        expand all
      </button>
      <button
        type="button"
        onClick={() => setAll(false)}
        className="glass-interactive ui-radius-control type-meta px-3 py-2"
      >
        collapse all
      </button>
      <a
        href="/process/estelle-authorship-system.md"
        className="glass-interactive ui-radius-control type-meta px-3 py-2"
      >
        raw markdown ↗
      </a>
    </div>
  );
}
