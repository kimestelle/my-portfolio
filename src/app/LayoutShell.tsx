'use client';

import { useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MoodRingBackground from './design-deets/shader/MoodRingShader';
import { TextShimmerGroup } from './design-deets/text-shimmer/TextShimmer';
import { EntranceReadyProvider } from './EntranceReadyContext';

const SHADER_PREF_KEY = 'estelle-portfolio:shader-enabled';
const CELL_AUTOMATA_PREF_KEY = 'estelle-portfolio:cell-automata-enabled';
const PLAYGROUND_EXIT_MS = 220;

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [playgroundTransition, setPlaygroundTransition] = useState<'idle' | 'out' | 'reveal'>('idle');

  const shaderDisabled = useMemo(
    () => pathname.startsWith('/playground'),
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
      // Default ON: only an explicit saved "false" disables the shader.
      setShaderPref(cached === 'false' ? false : true);
      // Stars stay off (also gated by STARS_ENABLED in the shader) and the
      // toggle is hidden — the plumbing is kept but inert.
      setCellAutomataPref(false);
    } catch {
      setShaderPref(true);
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
    setShaderPref((value) => !(value ?? true));
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
    if (event.currentTarget.getAttribute('href') !== pathname) return;

    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }, [pathname]);

  const onPlaygroundNavigate = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (playgroundTransition === 'idle') setPlaygroundTransition('out');
  }, [playgroundTransition]);

  // The navbar and shader leave first; the playground route is allowed to do
  // its own loading after that small, fixed visual exit.
  useEffect(() => {
    if (playgroundTransition !== 'out' || shaderDisabled) return;
    const timer = window.setTimeout(() => router.push('/playground'), PLAYGROUND_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [playgroundTransition, router, shaderDisabled]);

  useEffect(() => {
    if (!shaderDisabled) {
      // Returning before the reveal timer completes must still restore the
      // original shader layer rather than preserving its transparent phase.
      if (playgroundTransition === 'reveal') setPlaygroundTransition('idle');
      return;
    }
    if (playgroundTransition === 'out') {
      setPlaygroundTransition('reveal');
      const timer = window.setTimeout(() => setPlaygroundTransition('idle'), 760);
      return () => window.clearTimeout(timer);
    }
  }, [playgroundTransition, shaderDisabled]);

  return (
    <EntranceReadyProvider ready={entranceReady}>
      <NavBar
        shaderOn={shaderEnabled}
        cellAutomataOn={cellAutomataPref === true}
        playground={shaderDisabled}
        shaderDisabled={shaderDisabled}
        collapsingToPlayground={playgroundTransition === 'out'}
        playgroundTransitioning={playgroundTransition !== 'idle'}
        onToggleShader={onToggleShader}
        onToggleCellAutomata={onToggleCellAutomata}
        onRouteNavigate={onRouteNavigate}
        onPlaygroundNavigate={onPlaygroundNavigate}
      />

      <TextShimmerGroup
        key={pathname}
        seed={pathname}
        playing={textShimmerPlaying}
        onComplete={onEntranceComplete}
      >
        {children}
      </TextShimmerGroup>
      {!shaderDisabled && <Footer />}
      <MoodRingBackground
        enabled={shaderEnabled}
        onFps={onFps}
        onReady={onShaderReady}
        cellAnimationPaused={!entranceReady}
        playgroundTransition={playgroundTransition}
      />
    </EntranceReadyProvider>
  );
}
