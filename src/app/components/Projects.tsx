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
    name: 'Mini Minecraft',
    date: 'Fall 2024',
    label: '3D Graphics Engine',
    url: 'https://github.com/kimestelle/mini-minecraft-opengl.git',
    languages: ['OpenGL', 'GLSL', 'C++'],
    description: 'Mini-Minecraft group project from CIS4600',
    imageUrls: ['/project-images/coming-soon-1.png','/project-images/coming-soon-2.png']
  }),
  buildProject({
    name: 'Better-Spelling-Bee',
    date: 'Summer 2024',
    label: 'Full Stack & Game Dev',
    url: 'donationpage.com',
    languages: ['React','Typescript','Python','Django', 'PostgreSQL'],
    description: "My friend and I remade our favorite mobile game (NYT Spelling Bee!), focusing on enhancing user engagement through dynamic interactions and personalized features.\n" +
  "\nDesign Challenges:\n" +
  "- Developed a minimal and responsive web interface, ensuring ease of use while incorporating subtle animations to give the screen life.\n" +
  "- Created a customizable duck avatar and letter block, designed to attract user interaction through playful, tangible draggable objects.\n" +
  "\nDevelopment Challenges:\n" +
  "- Efficient algorithm to source a dictionary subset from 7 letters, including a pangram, by processing and sorting a large dictionary (46,444 words) and indexing it by letter + creating a separate source of pangrams to pull the letters from.\n" +
  "- Drag-and-drop functionality for the duck graphics, ensuring they could be seamlessly cloned/dragged onto words and reordered dynamically using painstaking CSS details and npm packages.\n" +
  "- Complex game and user data states, appropriate caching to maintain performance across gameplay sessions.\n" +
  "- JWT token management for secure user authentication and session persistence.\n" +
  "\nNext Steps:\n" +
  "- Deploy site\n" +
  "- Recover some animations gone MIA after restructuring app (ducks in pond randomly flapping, fly and sink animations upon entering word).\n",

  imageUrls: ['/project-images/better-spelling-bee/bsb-demo.mp4',
      '/project-images/better-spelling-bee/image-1.png',
      '/project-images/better-spelling-bee/image-2.png',
    '/project-images/better-spelling-bee/image-3.png',
  '/project-images/better-spelling-bee/image-4.png',
'/project-images/better-spelling-bee/image-5.png',]
  })
];

export default function Code() {
  const [activeProject, setActiveProject] = useState<Code | null>(projects[0]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const handleProjectChange = (project: Code) => {
    setActiveProject(project);
    setSelectedProjects(prevSelectedProjects => new Set(prevSelectedProjects).add(project.name));
  };

  return (
    <div className='flex flex-col gap-5 md:px-20'>
      <div className='flex flex-row gap-2 items-center max-md:px-10 pt-10'>
        <h2>Code</h2>
        {/* <div className='w-full border-b-2 border-dotted border-gray-700' /> */}
        {/* <img src='icons/backend.png' className='h-6'/> */}
        {/* <img src='icons/frontend.png' className='h-7'/> */}
      </div>
      <div className='flex flex-col w-full sm:flex-row gap-5 max-md:pl-10'>
        <ul className='flex flex-1 flex-col sm:mt-3 clickable pr-10'>
        <li className='mb-3'><a href='/playground' className='text-[1em] red font-bold'>{"click me :-)"}</a></li>
          {projects.map((project, index) => (
            <li
              key={index}
              className='flex flex-row items-center gap-2 cursor-pointer'
              onClick={() => handleProjectChange(project)}
            >
              <div
                className={`w-[0.8em] h-[0.8em] rounded-[1em] border border-[#E70503] ${selectedProjects.has(project.name) ? 'bg-[#E70503]' : 'bg-transparent'}`}
              />
              <h3 className={` w-max text-base font-greycliff ${activeProject?.name === project.name ? 'red' : ''}`}>
                {project.name}
              </h3>
            </li>
          ))}
        
        </ul>
        <div className='h-[34rem] md:h-[32rem] md:pr-12 w-full flex flex-grow overflow-scroll scrollbar-hide flex-col gap-2 p-4 red-radial-gr'>
        {activeProject ? (<CodeBlock project={activeProject} />) : (
          <div className='w-full h-80 ml-5 -mb-10 mt-3 -mr-2'/>
        )}
        </div>
      </div>
      <div id='creativity' className='h-0'/>
    </div>
  );
}
