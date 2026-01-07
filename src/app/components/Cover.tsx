'use client';
import { CursorTooltip } from './Tooltip';
import ProjectHTML from './ProjectHTML';

type CoverProps = {
  onScrollZoneActive?: (active: boolean) => void;
};

export default function Home() {

  return (
    <div className='responsive-padding flex flex-col items-center pt-24'>
        <div className='w-full h-full max-w-2xl flex flex-col justify-start items-start'>
        <h1>
          Estelle Kim
        </h1>
        <h3>
          creative technologist, CS + CG @ UPenn
        </h3>
        <div className="w-full my-4 flex items-center gap-3">      
          <CursorTooltip content={'download resume'} placement='bottom'>
            <a href='/EUNYUL_KIM_2027.pdf' className='ml-0.5' target='_blank' rel='noopener noreferrer'>
              <img src='/icons/download.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>   
          </CursorTooltip> 
          <CursorTooltip content={"let's chat!"} placement='bottom'>
            <a href='mailto:kestelle@sas.upenn.edu' className='ml-2'>
              <img src='/icons/mail-icon-black.svg' className='inline w-[1.0rem] h-[0.9rem] mb-0.5'/>
            </a>   
          </CursorTooltip>    
          <CursorTooltip content={'LinkedIn profile'} placement='bottom'>
            <a href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/linkedin.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
          </CursorTooltip>
          <CursorTooltip content={'GitHub repos'} placement='bottom'>
            <a href='https://github.com/kimestelle' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/gh-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
          </CursorTooltip>
          <CursorTooltip content={'X handle'} placement='bottom'>
            <a href='https://x.com/estelleeykim' target='_blank' rel='noopener noreferrer' className='ml-2'>
              <img src='/icons/x-logo.svg' className='inline w-[0.9rem] h-[0.9rem] mb-1'/>
            </a>
          </CursorTooltip>
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <p>
          I build interactive experiences that ship to production, including
          real-time graphics, full-stack engineering, physical computing, and ML pipelines. I 
          love collaborating with designers to make ambitious ideas actually work at scale.
        </p>

        <ProjectHTML />
        
        
        </div>
    </div>
  );
}