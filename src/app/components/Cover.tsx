'use client';
import { CursorTooltip } from './Tooltip';
import Image from 'next/image';
import ProjectHTML from './ProjectHTML';

export default function Home() {

  return (
    <div className='responsive-padding flex flex-col items-center pt-24'>
        <div className='w-full h-full max-w-2xl flex flex-col justify-start items-start'>
        <h1>
          Estelle Kim
        </h1>
        <h3>
          Graphics / Software Engineer, CS + CG @ UPenn
        </h3>
        <div className="w-full my-4 flex items-center gap-3">      
          <CursorTooltip content={'download resume'} placement='bottom'>
            <a href='/EUNYUL_KIM_2027.pdf' className='ml-0.5' target='_blank' rel='noopener noreferrer'>
              <Image src='/icons/download.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'
                  alt='Resume icon'
                  width={50} height={50}
                />
            </a>   
          </CursorTooltip> 
          <CursorTooltip content={"let's chat!"} placement='bottom'>
            <a href='mailto:kestelle@sas.upenn.edu' className='ml-2'>
              <Image src='/icons/mail-icon-black.svg' className='inline w-[1.0rem] h-[0.9rem] mb-0.5'
                  alt='Email icon'
                  width={50} height={50}
                />
            </a>   
          </CursorTooltip>    
          <CursorTooltip content={'LinkedIn profile'} placement='bottom'>
            <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <Image src='/icons/linkedin.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'
                  alt='LinkedIn icon'
                  width={50} height={50}
                />
            </a>
          </CursorTooltip>
          <CursorTooltip content={'GitHub repos'} placement='bottom'>
            <a href='https://github.com/kimestelle' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <Image src='/icons/gh-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'
                  alt='Github icon'
                  width={50} height={50}
                />
            </a>
          </CursorTooltip>
          <CursorTooltip content={'X handle'} placement='bottom'>
            <a href='https://x.com/estelleeykim' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <Image src='/icons/x-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'
                  alt='X icon'
                  width={50} height={50}
                />
            </a>
          </CursorTooltip>
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <p>
          I build user-facing tools that ship to production, combining real-time graphics, full-stack engineering, and data.
          I love collaborating with designers to to turn complex ideas into reliable, scalable systems.
        </p>

        <p className='mt-3'>
          Currently seeking summer 2026 internships!
        </p>

        <ProjectHTML />
        
        
        </div>
    </div>
  );
}