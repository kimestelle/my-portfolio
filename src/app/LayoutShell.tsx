'use client';

import { useCallback, useMemo, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MoodRingBackground from './design-deets/shader/MoodRingShader';

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const shaderDisabled = useMemo(
    () => pathname.startsWith('/playground'),
    [pathname]
  );

  // user shader preference
  const [shaderPref, setShaderPref] = useState(true);
  const [fps, setFps] = useState(0);

  // decide if shader is enabled
  const shaderEnabled = shaderPref && !shaderDisabled;

  const onToggleShader = useCallback(() => {
    if (shaderDisabled) return;
    setShaderPref((v) => !v);
  }, [shaderDisabled]);

  const onFps = useCallback((v: number) => setFps(v), []);

  return (
    <>
      <NavBar
        fps={fps}
        shaderOn={shaderEnabled}
        playground={shaderDisabled}
        shaderDisabled={shaderDisabled}
        onToggleShader={onToggleShader}
      />

      {children}
      <Footer />
      <MoodRingBackground enabled={shaderEnabled} onFps={onFps} />
    </>
  );
}
