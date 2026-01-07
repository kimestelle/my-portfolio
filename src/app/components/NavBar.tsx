'use client';
import Link from "next/link";
import { CursorTooltip } from "./Tooltip";

export interface NavBarProps {
  hide?: boolean;
  fps?: number;
  shaderOn: boolean;
  shaderDisabled?: boolean;
  onToggleShader?: () => void;
}

export default function NavBar({ hide, fps = 0, shaderOn = true, shaderDisabled, onToggleShader }: NavBarProps) {
  
  return (
    <nav className={`${hide ? ('hidden') : ('')} navbar px-4 py-2 md:px-5 w-fit fixed top-6 left-1/2 -translate-x-2/3 flex flex-row z-[10]`}>
      <Link className="mr-4 md:mr-8" href="/">.*✦</Link>
      <Link className="mr-4 md:mr-8" href="/projects">projects</Link>
      <Link className="mr-4 md:mr-8" href="/about">about</Link>
      <Link href="/playground">playground</Link>
      <div className='w-0 h-px relative'>
        <CursorTooltip 
          content={shaderDisabled ? "shader is disabled on this page :-(": "cool shader? click to toggle!"}
          placement="bottom"

        >
          <span className='w-max cursor-pointer select-none absolute top-0.5 -right-8 md:-right-10 translate-x-[100%]'
            style={{
              color: 'rgb(20, 20, 20)',
            }}
            onClick={onToggleShader}
          >
            {shaderOn ? `fps ${fps.toFixed(0)}: ` : 'shader '} 
            <span
              style={{
                backgroundColor: 'rgb(20, 20, 20, 0.5)',
                color: 'white',
                padding: '4px 6px',
                borderRadius: '4px',
              }}
            >{shaderOn ? 'on' : 'off'}</span>
          </span>
        </CursorTooltip>
      </div>
    </nav>
  );
}