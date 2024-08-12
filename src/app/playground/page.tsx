"use client"

import { useState } from 'react';

const Pages = [
    { name: 'fives', url: 'https://five-pink.vercel.app/' },
    { name: 'skyline', url: 'https://kimestelle.github.io/city-skyline/' },
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
            <nav className='w-full h-12 flex flex-row justify-between items-center z-10 gap-5 p-2 px-10 bg-white fixed border-b border-color-gray-400'>
                <a href='/#cover'>
                    <img src='icons/home.svg' className='w-[1.5em]' />
                </a>
                <div className='flex flex-row gap-3 items-center text-xl'>
                    <button onClick={goToPreviousPage}>&lt;</button>
                    /
                    <button onClick={goToNextPage}>&gt;</button>
                </div>
                <a onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img className='w-[1.5em]' src='icons/playground.svg' />
                </a>
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
