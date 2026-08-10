'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CursorTooltip } from './Tooltip';
import './NavBar.css';

export interface NavBarProps {
  hide?: boolean;
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
  shaderOn = false,
  playground = false,
  shaderDisabled,
  collapsingToPlayground = false,
  playgroundTransitioning = false,
  onToggleShader,
  onRouteNavigate,
  onPlaygroundNavigate,
}: NavBarProps) {
  const [mounted, setMounted] = useState(false);
  const compact = playground || collapsingToPlayground;

  useEffect(() => setMounted(true), []);

  // Fixed-position type must never paint before styled-jsx has hydrated; the
  // unstyled fallback otherwise flashes at the document origin.
  if (!mounted) return null;

  return (
    <nav className={`portfolio-nav${compact ? ' is-compact' : ''}${playgroundTransitioning ? ' is-transitioning' : ''}${hide ? ' is-hidden' : ''}`}>
      <span className="glass-surface ui-radius-pill portfolio-nav__shell" aria-hidden="true" />
      <Link className="portfolio-nav__glyph" href="/" aria-label="Home" onClick={onRouteNavigate}>.*✦</Link>
      <div className="portfolio-nav__matter" aria-hidden={compact}>
        <Link tabIndex={compact ? -1 : undefined} href="/projects" onClick={onRouteNavigate}>projects</Link>
        <Link tabIndex={compact ? -1 : undefined} href="/about" onClick={onRouteNavigate}>about</Link>
        <Link tabIndex={compact ? -1 : undefined} href="/playground" onClick={onPlaygroundNavigate}>playground</Link>
      </div>
      <div className="portfolio-nav__status" aria-hidden={compact}>
        <CursorTooltip
          content={
            shaderDisabled
              ? 'shader is unavailable on this page'
              : 'toggle the background shader'
          }
          placement="bottom"
        >
          <button
            className={`portfolio-nav__toggle ${
              shaderOn ? 'is-on' : 'is-off'
            }`}
            type="button"
            tabIndex={compact ? -1 : undefined}
            onClick={onToggleShader}
            aria-pressed={shaderOn}
            aria-label={`Background shader ${shaderOn ? 'on' : 'off'}. Click to toggle.`}
          >
            <span className="portfolio-nav__toggle-track" aria-hidden="true">
              <span className="portfolio-nav__toggle-knob" />
            </span>
          </button>
        </CursorTooltip>
      </div>
    </nav>
  );
}
