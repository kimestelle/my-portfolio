import styles from './hop.module.css';

export type CursorMode = 'idle' | 'hover' | 'active' | 'tip' | 'tip-active';

type HopCursorOptions = {
  canvas: HTMLCanvasElement;
  isColorMode: () => boolean;
  mount: HTMLElement;
};

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="slider"]:not([aria-disabled="true"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

function appendShape(
  graphic: SVGSVGElement,
  tag: 'circle' | 'polygon',
  attributes: Record<string, string>,
  classNames: string[],
) {
  const shape = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attributes).forEach(([name, value]) => {
    shape.setAttribute(name, value);
  });
  shape.classList.add(...classNames);
  graphic.appendChild(shape);
}

function createCursorElement() {
  const cursor = document.createElement('div');
  cursor.className = styles.customCursor;
  cursor.dataset.visible = 'false';
  cursor.dataset.mode = 'idle';
  cursor.setAttribute('aria-hidden', 'true');

  const graphic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  graphic.classList.add(styles.cursorGraphic);
  graphic.setAttribute('viewBox', '0 0 20 20');
  graphic.setAttribute('focusable', 'false');
  cursor.appendChild(graphic);

  const circle = { cx: '10', cy: '10', r: '6.55' };
  const triangle = { points: '3 4 17 4 10 16.124' };

  appendShape(graphic, 'circle', circle, [styles.cursorBlur, styles.cursorCircle]);
  appendShape(graphic, 'polygon', triangle, [styles.cursorBlur, styles.cursorTriangle]);
  appendShape(graphic, 'circle', circle, [styles.cursorOutline, styles.cursorCircle]);
  appendShape(graphic, 'polygon', triangle, [styles.cursorOutline, styles.cursorTriangle]);
  appendShape(graphic, 'circle', { cx: '10', cy: '10', r: '1.2' }, [
    styles.cursorDot,
    styles.cursorCircle,
  ]);
  appendShape(graphic, 'circle', { cx: '10', cy: '8.04', r: '1.2' }, [
    styles.cursorDot,
    styles.cursorTriangle,
  ]);

  return cursor;
}

export function createHopCursor({ canvas, isColorMode, mount }: HopCursorOptions) {
  const element = createCursorElement();
  let requestedMode: CursorMode = 'idle';
  mount.appendChild(element);

  const setMode = (mode: CursorMode) => {
    requestedMode = mode;
    if (isColorMode() && mode === 'tip') {
      element.dataset.mode = 'hover';
      return;
    }
    if (isColorMode() && mode === 'tip-active') {
      element.dataset.mode = 'active';
      return;
    }
    element.dataset.mode = mode;
  };

  const isActive = () => (
    element.dataset.mode === 'active' || element.dataset.mode === 'tip-active'
  );

  const update = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      element.dataset.visible = 'false';
      return;
    }
    const bounds = mount.getBoundingClientRect();
    element.style.transform = `translate3d(${event.clientX - bounds.left}px, ${
      event.clientY - bounds.top
    }px, 0)`;
    element.dataset.visible = 'true';
  };

  const handlePointerMove = (event: PointerEvent) => {
    update(event);
    if (event.target === canvas || isActive()) return;
    setMode(isInteractiveTarget(event.target) ? 'hover' : 'idle');
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.target === canvas || !isInteractiveTarget(event.target)) return;
    update(event);
    setMode('active');
  };

  const handlePointerEnd = (event: PointerEvent) => {
    if (event.target === canvas) return;
    setMode(isInteractiveTarget(event.target) ? 'hover' : 'idle');
  };

  const handlePointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null && !isActive()) {
      element.dataset.visible = 'false';
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerup', handlePointerEnd, { passive: true });
  window.addEventListener('pointercancel', handlePointerEnd, { passive: true });
  window.addEventListener('pointerout', handlePointerOut);

  return {
    element,
    refresh: () => setMode(requestedMode),
    setMode,
    update,
    destroy: () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('pointerout', handlePointerOut);
      element.remove();
    },
  };
}
