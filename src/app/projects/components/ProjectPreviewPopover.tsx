'use client';

// Click-triggered, interactive preview popover.
// Built on the same @floating-ui pattern as CursorTooltip, but pinned (not
// cursor-following) and pointer-events enabled so live iframes are usable.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
} from '@floating-ui/react-dom';

function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

const ANIM_MS = 220;

type PreviewPopoverProps = {
  label: ReactNode;
  children: ReactNode;
  placement?: Placement;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
};

export function PreviewPopover({
  label,
  children,
  placement = 'right-start',
  active,
  onActiveChange,
}: PreviewPopoverProps) {
  // controlled or uncontrolled open state
  const [internalOpen, setInternalOpen] = useState(false);
  const open = active ?? internalOpen;
  const setOpen = (v: boolean) => {
    onActiveChange?.(v);
    if (active === undefined) setInternalOpen(v);
  };

  const [present, setPresent] = useState(open);
  const unmountTimer = useRef<number | null>(null);

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware: [offset(12), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (open) {
      if (unmountTimer.current) window.clearTimeout(unmountTimer.current);
      setPresent(true);
    } else if (present) {
      unmountTimer.current = window.setTimeout(() => setPresent(false), ANIM_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // close on outside click + escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const f = refs.floating.current;
      const r = refs.reference.current as HTMLElement | null;
      const t = e.target as Node;
      if (f && !f.contains(t) && r && !r.contains(t)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, refs]);

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`w-full text-left transition-opacity ${
          open ? 'opacity-100' : 'opacity-70 hover:opacity-100'
        }`}
      >
        {label}
      </button>

      {present && (
        <Portal>
          <div
            ref={refs.setFloating}
            role="dialog"
            className="z-[60] w-[min(28rem,90vw)] overflow-hidden rounded-xl border bg-white/90 backdrop-blur shadow-xl"
            style={{
              ...floatingStyles,
              opacity: open ? 1 : 0,
              transform: `${floatingStyles.transform ?? ''} scale(${open ? 1 : 0.98})`,
              transition: `opacity ${ANIM_MS}ms ease, transform ${ANIM_MS}ms ease`,
              willChange: 'opacity, transform',
            }}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
