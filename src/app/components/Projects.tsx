"use client";
import { useState } from 'react';
import ProjectBlock from './blocks/ProjectBlock';

export interface Project {
  name: string;
  date: string;
  label: string;
  url: string;
  languages: Array<string>;
  description: string;
  imageUrls: Array<string>;
}

function buildProject(projectObj: Project): Project {
  return projectObj;
}

const projects: Project[] = [
  buildProject({
    name: 'Daily Pennsylvanian Donation Page',
    date: 'Summer 2024',
    label: 'UI/UX',
    url: 'donationpage.com',
    languages: ['OCaml', 'Java'],
    description: 'skhbksfkau',
    imageUrls: ['/project-images/sample-1.png','/project-images/sample-2.png','/project-images/sample-3.png']
  }),
  buildProject({
    name: 'Better-Spelling-Bee',
    date: 'Summer 2024',
    label: 'UI/UX',
    url: 'donationpage.com',
    languages: ['OCaml', 'Java'],
    description: 'skhbksfkau',
    imageUrls: ['/project-images/sample-1.png','/project-images/sample-2.png','/project-images/sample-3.png']
  }),
  buildProject({
    name: 'Skyline Interactive',
    date: 'Spring 2024',
    label: 'Web Development',
    url: 'skylineinteractive.com',
    languages: ['JavaScript', 'React'],
    description: 'Interactive web experiences',
    imageUrls: ['/project-images/sample-1.png','/project-images/sample-2.png','/project-images/sample-3.png']
  }),
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const handleProjectChange = (project: Project) => {
    setActiveProject(project);
    setSelectedProjects(prevSelectedProjects => new Set(prevSelectedProjects).add(project.name));
  };

  return (
    <div className='flex flex-col gap-5 p-10'>
      <div className='flex flex-row gap-2'>
        <h2>Projects</h2>
        <div className='w-full border-b-2 border-dotted border-gray-700' />
      </div>
      <div className='flex flex-col w-full sm:flex-row gap-5'>
        <ul className='flex flex-1 flex-col gap-3 sm:mt-5 clickable'>
          {projects.map((project, index) => (
            <li
              key={index}
              className='flex flex-row items-center gap-1 cursor-pointer'
              onClick={() => handleProjectChange(project)}
            >
              <div
                className={`w-[0.8em] h-[0.8em] rounded-[1em] border border-red-500 ${selectedProjects.has(project.name) ? 'bg-red-500' : 'bg-transparent'}`}
              />
              <h3 className={` w-max ${activeProject?.name === project.name ? 'underline decoration-red-500 decoration-1 underline-offset-2' : ''}`}>
                {project.name}
              </h3>
            </li>
          ))}
        </ul>
        {activeProject ? (<ProjectBlock project={activeProject} />) : (
            <div id='course-container' className='w-full h-80 flex flex-grow flex-col gap-2 p-4 shadow-inner rounded-lg red-radial-gr-2'/>
        )}
      </div>
    </div>
  );
}
