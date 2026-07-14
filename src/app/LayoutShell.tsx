'use client';

import { useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MoodRingBackground from './design-deets/shader/MoodRingShader';

const SHADER_PREF_KEY = 'estelle-portfolio:shader-enabled';
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
  const [fps, setFps] = useState(0);

  // decide if shader is enabled
  const shaderEnabled = shaderPref === true && !shaderDisabled;

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(SHADER_PREF_KEY);
      // Only an explicit saved "false" disables the shader; stale or malformed
      // values should preserve the site's default-on behavior.
      setShaderPref(cached === 'false' ? false : true);
    } catch {
      setShaderPref(true);
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

  const onToggleShader = useCallback(() => {
    if (shaderDisabled) return;
    setShaderPref((value) => !(value ?? true));
  }, [shaderDisabled]);

  const onFps = useCallback((v: number) => setFps(v), []);

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
    <>
      <NavBar
        fps={fps}
        shaderOn={shaderEnabled}
        playground={shaderDisabled}
        shaderDisabled={shaderDisabled}
        collapsingToPlayground={playgroundTransition === 'out'}
        playgroundTransitioning={playgroundTransition !== 'idle'}
        onToggleShader={onToggleShader}
        onPlaygroundNavigate={onPlaygroundNavigate}
      />

      {children}
      {!shaderDisabled && <Footer />}
      <MoodRingBackground
        enabled={shaderEnabled}
        onFps={onFps}
        playgroundTransition={playgroundTransition}
      />
    </>
  );
}
