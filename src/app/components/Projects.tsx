"use client";

import { useState } from "react";
import CodeBlock from "./blocks/CodeBlock";

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
  buildProject({
    name: "Mini Minecraft",
    date: "Fall 2024",
    label: "3D Graphics Engine",
    url: "https://github.com/kimestelle/mini-minecraft-opengl.git",
    languages: ["OpenGL", "GLSL", "C++"],
    description: "Mini-Minecraft group project from CIS4600",
    imageUrls: ["/project-images/minecraft/image-1.png", "/project-images/minecraft/mc-demo.mp4"],
  }),
  buildProject({
    name: "OpenGL Projects",
    date: "Fall 2024",
    label: "3D Graphics Engine",
    url: "https://github.com/kimestelle/mini-minecraft-opengl.git",
    languages: ["OpenGL", "GLSL", "C++"],
    description: "Mini-Minecraft group project from CIS4600",
    imageUrls: ["/project-images/4600/image-1.png", "/project-images/4600/4600-demo.mp4"],
  }),
  buildProject({
    name: "Better-Spelling-Bee",
    date: "Summer 2024",
    label: "Full Stack & Game Dev",
    url: "donationpage.com",
    languages: ["React", "Typescript", "Python", "Django", "PostgreSQL"],
    description: "My friend and I remade our favorite mobile game (NYT Spelling Bee!), focusing on enhancing user engagement through dynamic interactions and personalized features.",
    imageUrls: [
      "/project-images/better-spelling-bee/image-1.png",
      "/project-images/better-spelling-bee/bsb-demo.mp4",
      "/project-images/better-spelling-bee/image-2.png",
    ],
  }),
  buildProject({
    name: "Holiday Gift Box",
    date: "Summer 2024",
    label: "React & Firebase",
    url: "donationpage.com",
    languages: ["React", "Typescript", "Python", "Django", "PostgreSQL"],
    description: "My friend and I remade our favorite mobile game (NYT Spelling Bee!), focusing on enhancing user engagement through dynamic interactions and personalized features.",
    imageUrls: [
      "/project-images/gift-box/image-1.png",
      "/project-images/gift-box/giftbox-demo.mp4",
      "/project-images/gift-box/image-2.png",
    ],
  }),
];

export default function Code() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  const handleProjectClick = (index: number) => {
    setActiveProjectIndex(index);
  };

  const closePopup = () => {
    setActiveProjectIndex(null);
  };

  const goToNextProject = () => {
    if (activeProjectIndex !== null) {
      setActiveProjectIndex((prevIndex) => ((prevIndex ?? 0) + 1) % projects.length);
    }
  };

  const goToPreviousProject = () => {
    if (activeProjectIndex !== null) {
      setActiveProjectIndex((prevIndex) =>
        prevIndex! === 0 ? projects.length - 1 : prevIndex! - 1
      );
    }
  };

  return (
    <div id='projects' className="flex flex-col gap-5 px-10 md:px-32">
      <div className="flex flex-row gap-2 items-center pt-10">
        <h2>Projects</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col p-4 shadow-inner rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => handleProjectClick(index)}
          >
            <img
              src={project.imageUrls[0]}
              alt={project.name}
              className="w-full aspect-square object-contain rounded-md mb-3 lazy-load"
              loading="lazy"
            />
            <h3 className="text-lg font-bold">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.label}</p>
          </div>
        ))}
      </div>

      {activeProjectIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 px-10 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closePopup}
            >
              ✕
            </button>
            <CodeBlock project={projects[activeProjectIndex]} />
            <div className="flex justify-between mt-5">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={goToPreviousProject}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={goToNextProject}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
