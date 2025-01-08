"use client"
import { marked } from "marked";
import { useState, useEffect } from 'react';
import './markdown.css'

const Pages = [
    { name: 'skysim', url: 'https://scattering-sky-sim.vercel.app/', 
        githubUrl: 'https://github.com/kimestelle/scattering-sky-sim', 
        apiUrl: "https://api.github.com/repos/kimestelle/scattering-sky-sim/readme"},
    { name: 'skyline', url: 'https://kimestelle.github.io/city-skyline/', 
        githubUrl:  'https://github.com/kimestelle/city-skyline',
        apiUrl: "https://api.github.com/repos/kimestelle/city-skyline/readme",},
    { name: 'musicograph', url: 'https://musicograph.vercel.app/', 
        githubUrl: 'https://github.com/kimestelle/musicograph',
        apiUrl: "https://api.github.com/repos/kimestelle/musicograph/readme",},
    { name: 'fives', url: 'https://five-pink.vercel.app/', 
        githubUrl: 'https://github.com/kimestelle/five',
        apiUrl: "https://api.github.com/repos/kimestelle/five/readme",},
  ];

export default function Playground() {
    const [sideVisible, setSideVisible] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(true);
    const [fadeIn, setFadeIn] = useState<boolean>(true);
    const [readmeContent, setReadmeContent] = useState<string>("");

    const fetchReadme = async (apiUrl: string) => {
        try {
          const response = await fetch(apiUrl, {
            headers: {
              Accept: "application/vnd.github.v3.raw",
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch README: ${response.status}`);
          }
          const markdown = await response.text();
          const htmlContent = await marked(markdown);
          setReadmeContent(htmlContent);
        } catch (error) {
          console.error(error);
          setReadmeContent("<p>Failed to load README.</p>");
        }
      };


    useEffect(() => {
        if (isDescriptionOpen) {
        fetchReadme(Pages[currentIndex].apiUrl);
        }
    }, [currentIndex, isDescriptionOpen]);

    const handleMouseEnter = () => {
        setSideVisible(true);
    };

    const handleMouseLeave = () => {
        setSideVisible(false);
    };

    const goToPreviousPage = () => {
        setIsDescriptionOpen(false);
        fadeToPage((currentIndex > 0 ? currentIndex - 1 : Pages.length - 1));
    };

    const goToNextPage = () => {
        setIsDescriptionOpen(false);
        fadeToPage((currentIndex < Pages.length - 1 ? currentIndex + 1 : 0));
    };

    const toggleDescription = () => {
        setIsDescriptionOpen(!isDescriptionOpen);
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
                    <p className='clickable user-select-none font-mono' onClick={toggleDescription}>click here for README</p>
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
            {isDescriptionOpen && (
                <div id='markdown'
                    className={`absolute top-0 left-0 w-full h-full overflow-scroll transition-opacity duration-500 bg-white text-black p-20 ${
                    fadeIn ? "opacity-100" : "opacity-0"
                    }`}
                    dangerouslySetInnerHTML={{ __html: readmeContent }}
                />        
            )}
            <iframe className={`w-[100svw] h-[100svh] overflow-hidden transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} 
                src={Pages[currentIndex].url}>
            </iframe>
        </div>
    );
}