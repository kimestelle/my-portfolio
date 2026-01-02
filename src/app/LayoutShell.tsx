'use client';

import { useCallback, useState } from 'react';
import NavBar from './components/NavBar';
import MoodRingBackground from './components/shader/MoodRingShader';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [shaderOn, setShaderOn] = useState(true);
  const [fps, setFps] = useState(0);

  const onToggleShader = useCallback(() => {
    setShaderOn((v) => !v);
  }, []);

  const onFps = useCallback((v: number) => {
    setFps(v);
  }, []);

  return (
    <>
      <NavBar fps={fps} shaderOn={shaderOn} onToggleShader={onToggleShader} />
      {children}
      <MoodRingBackground enabled={shaderOn} onFps={onFps} />
    </>
  );
}
