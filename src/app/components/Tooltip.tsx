'use client';

import { useState, useRef, useEffect, cloneElement, Children, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
} from '@floating-ui/react-dom';

type CursorTooltipProps = {
  children: ReactElement;
  content: ReactNode | ReactNode[];
  placement?: Placement;
  offsetPx?: number;
  openDelayMs?: number;
  closeDelayMs?: number;
  cycleMs?: number;
  panelClassName?: string;
};

type VirtualEl = {
  getBoundingClientRect: () => DOMRect;
};

function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

const ANIM_MS = 500;

export function CursorTooltip({
  children,
  content,
  placement = 'top',
  offsetPx = 12,
  openDelayMs = 60,
  closeDelayMs = 60,
  cycleMs,
  panelClassName = 'rounded-md border bg-white px-2 py-1 text-sm shadow-lg',
}: CursorTooltipProps) {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [index, setIndex] = useState(0);

  const mouseRef = useRef({ x: 0, y: 0 });
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const unmountTimer = useRef<number | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const virtualEl = useRef<VirtualEl>({
    getBoundingClientRect: () =>
      new DOMRect(mouseRef.current.x, mouseRef.current.y, 0, 0),
  });

  useEffect(() => {
    refs.setReference(virtualEl.current);
  }, [refs]);

  useEffect(() => {
    if (!open || !cycleMs) return;
    const t = window.setInterval(() => setIndex((i) => i + 1), cycleMs);
    return () => window.clearInterval(t);
  }, [open, cycleMs]);

  const resolved = Array.isArray(content)
    ? content[index % Math.max(1, content.length)]
    : content;

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (unmountTimer.current) window.clearTimeout(unmountTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
    unmountTimer.current = null;
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => {
      setPresent(true);
      //fade in
      requestAnimationFrame(() => {
        setOpen(true);
      });
    }, openDelayMs);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => {
      setOpen(false); //fade out
      unmountTimer.current = window.setTimeout(() => {
        setPresent(false);
      }, ANIM_MS);
    }, closeDelayMs);
  };

  const onMouseMove = (e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    if (present) update(); //keep updating while fading
  };

  const child = Children.only(children);
  const merged = cloneElement(child, {
    onMouseEnter: (e: MouseEvent) => {
      child.props.onMouseEnter?.(e);
      scheduleOpen();
    },
    onMouseLeave: (e: MouseEvent) => {
      child.props.onMouseLeave?.(e);
      scheduleClose();
    },
    onMouseMove: (e: MouseEvent) => {
      child.props.onMouseMove?.(e);
      onMouseMove(e);
    },
    onFocus: (e: FocusEvent) => {
      child.props.onFocus?.(e);
      scheduleOpen();
    },
    onBlur: (e: FocusEvent) => {
      child.props.onBlur?.(e);
      scheduleClose();
    },
  });

  useEffect(() => {
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {merged}

      {present && resolved != null && (
        <Portal>
          <div
            ref={refs.setFloating}
            role="tooltip"
            className={panelClassName}
            style={{
              ...floatingStyles,
              zIndex: 50,
              pointerEvents: 'none',

              opacity: open ? 1 : 0,
              transition: `opacity ${ANIM_MS}ms ease`,
              willChange: 'opacity',
            }}
          >
            {resolved}
          </div>
        </Portal>
      )}
    </>
  );
}
