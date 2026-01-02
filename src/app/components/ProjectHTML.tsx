'use client'

import { useMemo, useState } from 'react';
import { CursorTooltip } from './Tooltip';

type ProjectRole = 'full-stack technical lead' | 'frontend developer' | 'personal experiment';

type RoleProjects = Record<
  ProjectRole, { 
    title: string; 
    href?: string;
    imageSrc: string; 
    blurb?: string }[]
>;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function roleLabel(role: ProjectRole) {
  // Keep as-is or prettify slightly
  return role;
}

export default function ProjectHTML() {
  const data: RoleProjects = useMemo(
    () => ({
      'full-stack technical lead': [
        {
            title: 'Internet Atlas',
            href: 'https://www.figma.com/deck/hBWnB1ibfek3EVAF1d3vZM/Estelle-Kim-Portfolio-Slides?node-id=16-72',
            imageSrc: '/project-images/covers/atlas-cover.png',
            blurb: '3D graph interface + pipeline',
        },
        {
            title: 'Penn Spark Website',
            imageSrc: '/project-images/covers/spark-cover.png',
            blurb: 'Framing a beloved community',
        },
      ],
      'frontend developer': [
        {
            title: 'Penn Museum Scavenger Hunt',
            href: '/blog/into-the-blue',
            imageSrc: '/project-images/covers/museum-cover.png',
            blurb: 'Offline-first stickerboard',
        },
      ],
      'personal experiment': [
        {
            title: 'Watercolor Drip Shader',
            imageSrc: '/cover-images/watercolor-image.png',
            href: 'https://www.figma.com/deck/hBWnB1ibfek3EVAF1d3vZM/Estelle-Kim-Portfolio-Slides?node-id=43-266',
            blurb: 'Ping-pong drip sim',
        },
        {
            title: 'Magnetic Poetry',
            imageSrc: '/cover-images/poetry-image.png',
            href: '/blog/magnet-poetry',
            blurb: 'Tactile board + drag systems',
        },
        {
            title: 'Softbody Jelly',
            imageSrc: '/cover-images/blob-image.png',
            href: 'https://www.figma.com/deck/hBWnB1ibfek3EVAF1d3vZM/Estelle-Kim-Portfolio-Slides?node-id=18-136',
            blurb: 'Custom 2D/3D illusion',
        },        
      ],
    }),
    []
  );

  const roles: ProjectRole[] = Object.keys(data) as ProjectRole[];
  const [open, setOpen] = useState<ProjectRole | null>(null);

  return (
    <section className="w-full mt-10">
        <div className="mb-2 flex items-center gap-3">
            <h4>
                {'links:'}
            </h4>         
            <CursorTooltip 
                content={'download resume'}
                placement='bottom'
            >
                <a href='/EUNYUL_KIM_2027.pdf' className='ml-0.5' target='_blank' rel='noopener noreferrer'>
                    <img src='/icons/download.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
                </a>   
            </CursorTooltip> 
            <CursorTooltip 
                content={"let's chat!"}
                placement='bottom'
            >
                <a href='mailto:kestelle@sas.upenn.edu' className='ml-2'>
                    <img src='/icons/mail-icon-black.svg' className='inline w-[1.0rem] h-[0.9rem] mb-0.5'/>
                </a>   
            </CursorTooltip>    
            <CursorTooltip 
                content={'LinkedIn profile'}
                placement='bottom'
            >
            <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/linkedin.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
            </CursorTooltip>
            <CursorTooltip 
                content={'GitHub repos'}
                placement='bottom'
            >
            <a href='https://github.com/kimestelle' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/gh-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
            </CursorTooltip>
            <CursorTooltip 
                content={'X handle'}
                placement='bottom'
            >
            <a href='https://x.com/estelleeykim' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/x-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
            </CursorTooltip>
            <div className="h-px flex-1 bg-black/10" />
        </div>
        <div className="mt-8 mb-2 flex items-center gap-3">
            <h4>
                {'<selected work/>'}
            </h4>
            <div className="h-px flex-1 bg-black/10" />
        </div>

      <div className="mt-3 flex flex-col gap-3">
        {roles.map((role) => {
          const list = data[role];
          return (
            <div
              key={role}
            >
                <h5 className='mb-2'>{role}:</h5>
                <div className="flex flex-row flex-wrap gap-2">
                    {list.map((p) => (
                      <a
                        key={p.title}
                        href={p.href ?? '#'}
                        target={p.href?.startsWith('http') ? '_blank' : undefined}
                        rel={p.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group w-fit"
                      >
                        {p.title == 'Penn Spark Website' ? (
                        <CursorTooltip
                            content="coming soon!"
                            openDelayMs={100}
                            placement='right-end'
                        >
                        <div className="glass-card w-full">
                          <span>{p.title} - {p.blurb}</span>
                        </div>
                        </CursorTooltip>
                        ) : (
                        <CursorTooltip
                            content={<img src={p.imageSrc} alt={p.title} className="w-48 h-auto object-cover rounded-md shadow-md"/>}
                            openDelayMs={100}
                            placement='right-end'
                        >
                        <div className="glass-card w-full">
                          <span>{p.title} - {p.blurb}</span>
                        </div>
                        </CursorTooltip>
                        )}
                      </a>
                    ))}
                </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
