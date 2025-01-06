'use client';

import Skyline from './cover/Skyline';
import Image from 'next/image';

export default function About() {
    return (
        <div id='cover' className='relative flex flex-col w-full h-[100svh] justify-center items-start overflow-hidden'>
            <Skyline />
            <div className='absolute w-full p-8 flex flex-col justify-center items-center pointer-events-none'>
                <div className='flex flex-col md:flex-row gap-5 justify-center items-center'>
                    <h1 className="text-outline-white text-center text-[4em] md:text-[6em] z-3">Estelle Kim</h1>
                    <Image 
                        src='/coverportrait.png' 
                        width={200} 
                        height={200} 
                        className='h-24 w-24 mb-5' 
                        alt='Estelle Kim' 
                    />
                </div>
                <h3 className='text-outline-white text-center leading-tight -mt-2 text-[1em] md:text-[1.2em] z-3'>
                    Digital Media Design / CS <span className='red'>@</span> UPenn
                </h3>
                <p className='text-outline-white text-center max-w-[80svh] mt-8'>
                    Hi! I&apos;m a sophomore at the University of Pennsylvania interested in <span className='font-bold'>human-centered engineering</span>. I love thinking about experiences that transform people, as well as cool algorithms and systems. I&apos;m currently looking for summer 2025 opportunities; please feel free to reach out if you think I&apos;d be a good fit for your team!
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
        </div>
    );
}
