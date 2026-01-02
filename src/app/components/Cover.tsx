'use client';
import{ useState } from 'react';
import ProjectHTML from './ProjectHTML';

type CoverProps = {
  onScrollZoneActive?: (active: boolean) => void;
};

export default function Home() {

  return (
    <div className='responsive-padding flex flex-col items-center pt-24'>
        <div className='w-full h-full max-w-2xl flex flex-col justify-start items-start'>
          <h1 className="flex">
            Estelle Kim
              {/* <span className="block w-12 h-12 ml-2 -mt-3 head">
                <Image
                  src="/headshot.png"
                  alt="Estelle Kim headshot"
                  width={400}
                  height={400}
                  sizes="48px"
                  className="w-full h-full object-cover"
                />
              </span> */}
          </h1>
        <h3>
            design engineer / building end-to-end tools<br/>
            CS + CG @ UPenn 
        </h3>

        <ProjectHTML />
        
        
        </div>
    </div>
  );
}