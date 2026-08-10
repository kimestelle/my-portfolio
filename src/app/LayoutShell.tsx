'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MoodRingBackground from './design-deets/shader/MoodRingShader';
import { TextShimmerGroup } from './design-deets/text-shimmer/TextShimmer';
import { EntranceReadyProvider } from './EntranceReadyContext';

const SHADER_PREF_KEY = 'estelle-portfolio:shader-enabled-v2';
const CELL_AUTOMATA_PREF_KEY = 'estelle-portfolio:cell-automata-enabled';
const PLAYGROUND_ROUTE_OUT_MS = 180;
const PLAYGROUND_ROUTE_IN_MS = 360;

type PlaygroundTransition = 'idle' | 'out' | 'enter' | 'reveal';

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [playgroundTransition, setPlaygroundTransition] = useState<PlaygroundTransition>('idle');
  const pendingRouteRef = useRef<string | null>(null);
  const previousPathnameRef = useRef(pathname);

  const playgroundMode = useMemo(
    () => pathname.startsWith('/playground'),
    [pathname]
  );
  const hopMode = useMemo(
    () => pathname.startsWith('/hop'),
    [pathname]
  );
  const shaderDisabled = useMemo(
    () => playgroundMode || hopMode,
    [hopMode, playgroundMode]
  );
  const fieldNotesMode = useMemo(
    () => pathname.startsWith('/field-notes'),
    [pathname]
  );

  // user shader preference
  const [shaderPref, setShaderPref] = useState<boolean | null>(null);
  const [cellAutomataPref, setCellAutomataPref] = useState<boolean | null>(null);
  const [shaderReady, setShaderReady] = useState(false);
  const [entranceState, setEntranceState] = useState({
    pathname,
    ready: false,
  });

  // decide if shader is enabled
  const shaderEnabled = shaderPref === true && !shaderDisabled;

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(SHADER_PREF_KEY);
      // Keep the background quiet until someone explicitly opts into it.
      setShaderPref(cached === 'true');
      // Stars stay off (also gated by STARS_ENABLED in the shader) and the
      // toggle is hidden — the plumbing is kept but inert.
      setCellAutomataPref(false);
    } catch {
      setShaderPref(false);
      setCellAutomataPref(false);
    }
  }, []);

  useEffect(() => {
    if (shaderPref === null) return;
    try {
      window.localStorage.setItem(SHADER_PREF_KEY, String(shaderPref));
    } catch {
      // Storage may be unavailable in privacy modes; in-memory preference remains valid.
    }
  }, [shaderPref]);

  useEffect(() => {
    if (cellAutomataPref === null) return;
    try {
      window.localStorage.setItem(CELL_AUTOMATA_PREF_KEY, String(cellAutomataPref));
    } catch {
      // Storage may be unavailable in privacy modes; in-memory preference remains valid.
    }
  }, [cellAutomataPref]);

  const onToggleShader = useCallback(() => {
    if (shaderDisabled) return;
    setShaderPref((value) => !(value ?? false));
  }, [shaderDisabled]);

  const onToggleCellAutomata = useCallback(() => {
    if (shaderDisabled) return;
    setCellAutomataPref((value) => !(value ?? false));
  }, [shaderDisabled]);

  const onFps = useCallback((value: number) => {
    window.dispatchEvent(new CustomEvent('portfolio:shader-fps', {
      detail: value,
    }));
  }, []);
  const onShaderReady = useCallback(() => setShaderReady(true), []);
  const textShimmerPlaying = shaderDisabled || shaderPref === false || shaderReady;
  const entranceReady = entranceState.pathname === pathname && entranceState.ready;
  const onEntranceComplete = useCallback(() => {
    setEntranceState({ pathname, ready: true });
  }, [pathname]);

  useEffect(() => {
    if (!fieldNotesMode) {
      router.prefetch('/playground');
    }
  }, [fieldNotesMode, router]);

  const onRouteNavigate = useCallback((
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (
      event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || event.button !== 0
    ) {
      return;
    }
    const href = event.currentTarget.getAttribute('href');
    if (!href) return;

    if (href === pathname) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
      return;
    }

    if (
      shaderDisabled
      && playgroundTransition === 'idle'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      event.preventDefault();
      pendingRouteRef.current = href;
      setPlaygroundTransition('out');
    }
  }, [pathname, playgroundTransition, shaderDisabled]);

  const onPlaygroundNavigate = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (playgroundTransition === 'idle') {
      pendingRouteRef.current = '/playground';
      setPlaygroundTransition('out');
    }
  }, [playgroundTransition]);

  useEffect(() => {
    if (playgroundTransition !== 'out') return;
    const target = pendingRouteRef.current;
    if (!target || target === pathname) return;
    const timer = window.setTimeout(
      () => router.push(target),
      PLAYGROUND_ROUTE_OUT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [pathname, playgroundTransition, router]);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;
    if (previousPathname === pathname) return;

    const crossesPlayground = (
      previousPathname.startsWith('/playground')
      || pathname.startsWith('/playground')
    );
    if (!crossesPlayground) {
      pendingRouteRef.current = null;
      setPlaygroundTransition('idle');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pendingRouteRef.current = null;
      setPlaygroundTransition('idle');
      return;
    }

    // Put the newly rendered route at zero opacity before the browser paints,
    // including when navigation came from Back or Forward rather than the nav.
    setPlaygroundTransition('enter');
    const frame = window.requestAnimationFrame(
      () => setPlaygroundTransition('reveal'),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (playgroundTransition !== 'reveal') return;
    const timer = window.setTimeout(() => {
      pendingRouteRef.current = null;
      setPlaygroundTransition('idle');
    }, PLAYGROUND_ROUTE_IN_MS);
    return () => window.clearTimeout(timer);
  }, [playgroundTransition]);

  const routeContentStyle = {
    width: '100%',
    opacity: playgroundTransition === 'out' || playgroundTransition === 'enter'
      ? 0
      : 1,
    pointerEvents: playgroundTransition === 'out' || playgroundTransition === 'enter'
      ? 'none' as const
      : 'auto' as const,
    willChange: playgroundTransition === 'idle' ? 'auto' : 'opacity',
    transition: playgroundTransition === 'out'
      ? `opacity ${PLAYGROUND_ROUTE_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1)`
      : playgroundTransition === 'enter'
        ? 'none'
      : playgroundTransition === 'reveal'
        ? `opacity ${PLAYGROUND_ROUTE_IN_MS}ms cubic-bezier(0.22, 0.7, 0.25, 1)`
        : 'none',
  };

  return (
    <EntranceReadyProvider ready={entranceReady}>
      {!fieldNotesMode && !hopMode && (
        <NavBar
          shaderOn={shaderEnabled}
          cellAutomataOn={cellAutomataPref === true}
          playground={playgroundMode}
          shaderDisabled={shaderDisabled}
          collapsingToPlayground={playgroundTransition === 'out'}
          playgroundTransitioning={playgroundTransition !== 'idle'}
          onToggleShader={onToggleShader}
          onToggleCellAutomata={onToggleCellAutomata}
          onRouteNavigate={onRouteNavigate}
          onPlaygroundNavigate={onPlaygroundNavigate}
        />
      )}

      <TextShimmerGroup
        key={pathname}
        seed={pathname}
        playing={textShimmerPlaying}
        onComplete={onEntranceComplete}
      >
        <div style={routeContentStyle}>
          {children}
        </div>
      </TextShimmerGroup>
      {!shaderDisabled && !fieldNotesMode && <Footer />}
      {!hopMode && (
        <MoodRingBackground
          enabled={shaderEnabled}
          onFps={onFps}
          onReady={onShaderReady}
          cellAnimationPaused={!entranceReady}
          playgroundTransition="idle"
        />
      )}
    </EntranceReadyProvider>
  );
}
