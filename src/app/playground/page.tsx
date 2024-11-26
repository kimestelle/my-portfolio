"use client"

import { url } from 'inspector';
import { useState } from 'react';

const Pages = [
    { name: 'skyline', url: 'https://kimestelle.github.io/city-skyline/' },
    { name: 'musicograph', url: 'https://musicograph.vercel.app/' },
    { name: 'fives', url: 'https://five-pink.vercel.app/' },
  ];

export default function Playground() {
    const [sideVisible, setSideVisible] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [fadeIn, setFadeIn] = useState<boolean>(true);

    const handleMouseEnter = () => {
        setSideVisible(true);
    };

    const handleMouseLeave = () => {
        setSideVisible(false);
    };

    const goToPreviousPage = () => {
        fadeToPage((currentIndex > 0 ? currentIndex - 1 : Pages.length - 1));
    };

    const goToNextPage = () => {
        fadeToPage((currentIndex < Pages.length - 1 ? currentIndex + 1 : 0));
    };

    const setPage = (index: number) => {
        fadeToPage(index);
    };

    const fadeToPage = (index: number) => {
        setFadeIn(false);
        setTimeout(() => {
            setCurrentIndex(index);
            setFadeIn(true);
        }, 500);
    };

    const CurrentPage = Pages[currentIndex];

    return (
        <div className='w-[100svw] h-[100svh] bg-stone-900'>
            <nav className='w-full flex flex-row items-center z-10 gap-5 p-5 px-10 md:px-20 bg-white bg-opacity-30 fixed'>
            <div className="flex w-full items-center justify-between">
                <a href='/#cover'>
                    <img src='icons/home.svg' className='w-[1.7em]' />
                </a>

                {/* Arrow Buttons (Centered) */}
                <div className='flex flex-row gap-[3svh] items-center justify-center'>
                    <img src='icons/triangle-arrow.svg' onClick={goToPreviousPage} className='clickable w-[0.8em]' alt='left'/>
                    <img src='icons/info.svg' className='clickable w-[1.4em] md:w-[1.7em]' alt='info'/>
                    <img className='clickable w-[0.8em] rotate-180' src='icons/triangle-arrow.svg' onClick={goToNextPage} alt='right'/>
                </div>

                {/* Placeholder to maintain spacing for alignment */}
                <div className="w-[1.5em]"></div>
            </div>
            </nav>
            <div>
                {sideVisible && (
                    <ul onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {Pages.map((PageComponent, index) => (
                            <li key={index}>
                                <button onClick={() => setPage(index)}>
                                    {`Page ${index + 1}`}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <iframe className={`w-[100svw] h-[100svh] overflow-hidden transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} 
                src={Pages[currentIndex].url}>
            </iframe>
        </div>
    );
}