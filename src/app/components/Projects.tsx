"use client";
import { useState } from 'react';
import CodeBlock from './blocks/CodeBlock';

export interface Code {
  name: string;
  date: string;
  label: string;
  url: string;
  languages: Array<string>;
  description: string;
  imageUrls: Array<string>;
}

function buildProject(projectObj: Code): Code {
  return projectObj;
}

const projects: Code[] = [
  // buildProject({
  //   name: 'Skyline Interactive',
  //   date: '</> UI/UX',
  //   label: 'Web Development',
  //   url: 'https://kimestelle.github.io/city-skyline/',
  //   languages: ['React', 'Javascript', 'Vite'],
  //   description: 'A sandbox I built while learning React, used Vite to build.',
  //   imageUrls: ['/project-images/skyline/image-1.png','/project-images/skyline/image-2.png','/project-images/skyline/image-3.png']
  // }),
  buildProject({
    name: 'Better-Spelling-Bee',
    date: 'Summer 2024',
    label: 'Full Stack & Game Dev',
    url: 'donationpage.com',
    languages: ['React','Typescript','Python','Django'],
    description: 'COMING SOON',
    imageUrls: ['/project-images/better-spelling-bee/image-1.png',
      '/project-images/better-spelling-bee/image-2.png',
    '/project-images/better-spelling-bee/image-3.png',
  '/project-images/better-spelling-bee/image-4.png',
'/project-images/better-spelling-bee/image-5.png',]
  }),
  buildProject({
    name: 'Daily Pennsylvanian Donation Page',
    date: 'Summer 2024',
    label: '</> UI/UX',
    url: 'donationpage.com',
    languages: ['React', 'Typescript'],
    description: 'COMING SOON',
    imageUrls: ['/project-images/coming-soon-1.png','/project-images/coming-soon-2.png']
  })
];

export default function Code() {
  const [activeProject, setActiveProject] = useState<Code | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const handleProjectChange = (project: Code) => {
    setActiveProject(project);
    setSelectedProjects(prevSelectedProjects => new Set(prevSelectedProjects).add(project.name));
  };

  return (
    <div className='flex flex-col gap-5 p-10'>
      <div className='flex flex-row gap-2 items-center'>
        <h2>Projects</h2>
        {/* <div className='w-full border-b-2 border-dotted border-gray-700' /> */}
        {/* <img src='icons/backend.png' className='h-6'/> */}
        {/* <img src='icons/frontend.png' className='h-7'/> */}
      </div>
      <div className='flex flex-col w-full sm:flex-row gap-5'>
        <ul className='flex flex-1 flex-col sm:mt-5 clickable'>
          {projects.map((project, index) => (
            <li
              key={index}
              className='flex flex-row items-center gap-2 cursor-pointer'
              onClick={() => handleProjectChange(project)}
            >
              <div
                className={`w-[0.8em] h-[0.8em] rounded-[1em] border border-[#E70503] ${selectedProjects.has(project.name) ? 'bg-[#E70503]' : 'bg-transparent'}`}
              />
              <h3 className={` w-max text-sm font-greycliff ${activeProject?.name === project.name ? 'underline decoration-[#E70503] decoration-1 underline-offset-2' : ''}`}>
                {project.name}
              </h3>
            </li>
          ))}
          <li><a href='/playground' className='text-sm underline text-gray-400'>stuff I make for fun &gt;</a></li>
        </ul>
        <div className='h-80 w-full flex flex-grow overflow-scroll flex-col gap-2 p-4 red-radial-gr'>
        {activeProject ? (<CodeBlock project={activeProject} />) : (
          <div className='  w-full h-80 ml-5 -mb-10 mt-3 -mr-2'/>
        )}
        </div>
      </div>
      <div id='creativity' className='h-0'/>
    </div>
  );
}
