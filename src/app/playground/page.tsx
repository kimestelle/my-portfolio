"use client"

import { useState } from 'react';

import PlaygroundCover from './pages/PlaygroundCover';
import Graph from './pages/Graph';

const Pages = [PlaygroundCover, Graph];

export default function Playground() {
    const [sideVisible, setSideVisible] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleMouseEnter = () => {
        setSideVisible(true);
    };

    const handleMouseLeave = () => {
        setSideVisible(false);
    };

    const goToPreviousPage = () => {
        console.log(currentIndex)
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : Pages.length - 1));
    };

    const goToNextPage = () => {
        setCurrentIndex((prevIndex) => (prevIndex < Pages.length - 1 ? prevIndex + 1 : 0));
    };

    const setPage = (index: number) => {
        setCurrentIndex(index);
    };

    const CurrentPage = Pages[currentIndex];

    return (
        <div className='w-screen h-screens'>
            <nav className='w-full flex flex-row justify-between z-10 gap-5 p-5 px-10 bg-white fixed border-b border-color-gray-400'>
                <a href='/#cover'>
                    <img src='icons/home.svg' className='w-[1.9em]' />
                </a>
                <div className='flex flex-row gap-3 items-center text-xl'>
                    <button onClick={goToPreviousPage}>&lt;</button>
                    /
                    <button onClick={goToNextPage}>&gt;</button>
                </div>
                <a onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img className='w-[1.7em]' src='icons/playground.svg' />
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
            <div className='w-screen h-screen'>
                <CurrentPage />
            </div>
        </div>
    );
}
