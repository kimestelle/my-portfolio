'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CursorTooltip } from './Tooltip';
import './NavBar.css';

export interface NavBarProps {
  hide?: boolean;
  fps?: number;
  shaderOn: boolean;
  cellAutomataOn?: boolean;
  playground?: boolean;
  shaderDisabled?: boolean;
  collapsingToPlayground?: boolean;
  playgroundTransitioning?: boolean;
  onToggleShader?: () => void;
  onToggleCellAutomata?: () => void;
  onRouteNavigate?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onPlaygroundNavigate?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavBar({
  hide,
  fps = 0,
  shaderOn = true,
  playground = false,
  shaderDisabled,
  collapsingToPlayground = false,
  playgroundTransitioning = false,
  onToggleShader,
  onRouteNavigate,
  onPlaygroundNavigate,
}: NavBarProps) {
  const [mounted, setMounted] = useState(false);
  const [liveFps, setLiveFps] = useState(fps);
  const compact = playground || collapsingToPlayground;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onShaderFps = (event: Event) => {
      setLiveFps((event as CustomEvent<number>).detail);
    };
    window.addEventListener('portfolio:shader-fps', onShaderFps);
    return () => window.removeEventListener('portfolio:shader-fps', onShaderFps);
  }, []);

  // Fixed-position type must never paint before styled-jsx has hydrated; the
  // unstyled fallback otherwise flashes at the document origin.
  if (!mounted) return null;

  return (
    <nav className={`portfolio-nav${compact ? ' is-compact' : ''}${playgroundTransitioning ? ' is-transitioning' : ''}${hide ? ' is-hidden' : ''}`}>
      <span className="portfolio-nav__shell" aria-hidden="true" />
      <Link className="portfolio-nav__glyph" href="/" aria-label="Home" onClick={onRouteNavigate}>.*✦</Link>
      <div className="portfolio-nav__matter" aria-hidden={compact}>
        <Link tabIndex={compact ? -1 : undefined} href="/projects" onClick={onRouteNavigate}>projects</Link>
        <Link tabIndex={compact ? -1 : undefined} href="/about" onClick={onRouteNavigate}>about</Link>
        <Link tabIndex={compact ? -1 : undefined} href="/playground" onClick={onPlaygroundNavigate}>playground</Link>
      </div>
      <div className="portfolio-nav__status" aria-hidden={compact}>
        <CursorTooltip
          content={shaderDisabled ? 'shader is disabled on this page :-(' : 'cool shader? click to toggle!'}
          placement="bottom"
        >
          <button
            className="portfolio-nav__toggle"
            type="button"
            tabIndex={compact ? -1 : undefined}
            onClick={onToggleShader}
            aria-pressed={shaderOn}
          >
            {shaderOn ? `fps ${liveFps.toFixed(0)}: ` : 'shader '}
            <span>{shaderOn ? 'on' : 'off'}</span>
          </button>
        </CursorTooltip>
      </div>
    </nav>
  );
}
