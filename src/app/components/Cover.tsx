'use client';

import Skyline from './cover/Skyline';
import Image from 'next/image';

export default function About() {
    return (
        <div id='cover' className='relative flex flex-col w-full justify-center'>
            {/* <Skyline /> */}
            <div className=' w-full p-8 flex flex-col gap-5 justify-start items-center pointer-events-none'>
                <div className='pt-36 flex flex-col md:flex-row gap-5 justify-center items-center'>
                    <h1 className="text-outline-white text-center text-[4em] md:text-[6em] z-3">Estelle Kim</h1>
                    <Image 
                        src='/cover-portrait.jpg' 
                        className='rounded-full object-cover w-24 h-24 mb-5'
                        width={200} 
                        height={200} 
                        alt='Estelle Kim' 
                    />
                </div>
                <h3 className='font-roboto text-center -mt-2 text-[1.2em] md:text-[1.8em] z-3'>
                     CS + CG &apos;27 <span className='red'>@</span> UPenn
                </h3>
                <p className='text-center'>
                creative engineer | building experiences to inspire people
                </p>
                <div className='flex flex-row gap-5 mt-5 justify-center items-center'>
                    <a 
                        href='https://www.linkedin.com/in/estelle-kim-41b1b7218/' 
                        target="_blank" 
                        className='flex items-center gap-2 font-bold text-[0.8rem] pointer-events-auto'
                    >
                        <Image 
                            src='/icons/linkedin.svg' 
                            alt='LinkedIn' 
                            width={20} 
                            height={20} 
                            className='h-5 w-5'
                        />
                    </a>
                    <a target='_blank' href='https://github.com/kimestelle'>
                        <Image 
                            src='/icons/gh-logo.svg' 
                            alt='GitHub' 
                            width={24} 
                            height={24} 
                            className='h-6 w-6 pointer-events-auto' 
                        />
                    </a>
                    <a href='mailto:kestelle@sas.upenn.edu'>
                        <Image 
                            src='/icons/mail-icon-black.svg' 
                            alt='Mail' 
                            width={24} 
                            height={24} 
                            className='h-6 w-6 pointer-events-auto' 
                        />
                    </a>
                </div>
            </div>
                    {/* <Image src="/wave-border.svg" alt="wave border" width={700} height={100} className='scale-[1.05] h-auto w-full border-black object-contain'/> */}
        </div>
    );
}
