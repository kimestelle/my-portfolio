"use client";

import { useState } from "react";
import CodeBlock from "./blocks/CodeBlock";

export interface TechStack {
  languages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  platforms: string[];
}

export interface Code {
  name: string;
  date: string;
  label: string;
  url: string;
  techStack: TechStack;
  description: string;
  imageUrls: string[];
  cover: string;
}

const colorClasses = [
  "bg-gray-200",
  "bg-gray-100",
  "bg-gray-100",
  "bg-gray-100",
  "bg-gray-100",
];

function buildProject(projectObj: Code): Code {
  return projectObj;
}

const projects: Code[] = [
  buildProject({
    name: "Mini Minecraft",
    date: "Fall 2024",
    label: "A rendition of Minecraft using OpenGL",
    url: "https://github.com/kimestelle/mini-minecraft-opengl.git",
    techStack: {
      languages: ["C++", "GLSL"],
      frameworks: [],
      libraries: [],
      databases: [],
      platforms: ["OpenGL"],
    },
    description: "Playable minecraft simulation built with OpenGL as final project for CIS4600. The project was completed in with two team members across three milestones, focusing on modularity, optimization, and engaging graphics.\n\nMy Contributions:\n\nTerrain Rendering and Chunking:\n  - Designed a chunk-based system to optimize terrain rendering by dynamically loading and unloading visible chunks based on the player’s position.\n  - Developed interleaved Vertex Buffer Objects (VBOs) to efficiently store and render chunk geometry, ensuring only visible faces were processed, reducing GPU load.\n\nTexture Mapping and Animation:\n  - Mapped block textures with UV coordinates, including distinct faces for blocks like grass (top, sides, bottom).\n  - Implemented animated textures for water and lava using time-dependent transformations, creating smooth, looping motions.\n  - Debugged and refined the texture rendering pipeline, ensuring compatibility with the interleaved VBO structure.\n\nDynamic Sky:\n  - Built a custom sky shader featuring:\n    - A procedurally animated day-night cycle with moving sun.\n    - Animated clouds using Worley noise and fractional Brownian motion.\n\nFluid Surface Waves and Reflection:\n  - Developed realistic water and lava wave simulations by dynamically displacing vertex positions in the shader using sine and cosine functions.\n  - Recalculated normals in the vertex shader to accurately reflect light on moving surfaces.\n  - Enhanced visibility of movement with Blinn-Phong highlights.",
    imageUrls: ["/project-images/minecraft/mc-demo.mp4"],
    cover: '/project-images/minecraft/image-1.png'
  }),
  buildProject({
    name: "Better-Spelling-Bee",
    date: "Summer 2024",
    label: "Full-stack web app",
    url: "donationpage.com",
    techStack: {
      languages: ["TypeScript", "Python"],
      frameworks: ["Next.js", "Django"],
      libraries: ["React"],
      databases: ["PostgreSQL"],
      platforms: [],
    },
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
    imageUrls: [
      "/project-images/better-spelling-bee/bsb-demo.mp4",
      "/project-images/better-spelling-bee/image-1.png",
      "/project-images/better-spelling-bee/image-2.png",
    ],
    cover: "/project-images/better-spelling-bee/image-1.png",
  }),
  buildProject({
    name: "Holiday Gift Box",
    date: "Fall 2024",
    label: "Virtual gift box with React and Firebase",
    url: "https://estelles-giftbox.vercel.app/6927",
    techStack: {
      languages: ["TypeScript"],
      frameworks: ["Next.js"],
      libraries: ["React"],
      databases: [],
      platforms: ["Firebase", "Vercel"],
    },
    description:"As someone who loves writing handwritten letters but lives far from most of my loved ones, I wanted to capture the warmth, spontaneity, and joy of receiving a handwritten note through a simple text message. To achieve this, I designed a UI that features a custom font based on my own handwriting, hand-drawn graphics, and a 2D physics engine paired with an animated gift box to evoke a sense of physical space. \n\nTo create a seamless experience (since opening gifts should never be a task) while ensuring each person's information is secure, I stored unique IDs in the URL route directly sent to recipients to retrieve Firebase documents, preventing unauthorized access to other users' messages.",
    imageUrls: [
      "/project-images/gift-box/giftbox-demo.mp4",
      "/project-images/gift-box/image-1.png",
      "/project-images/gift-box/image-2.png",
    ],
    cover: "/project-images/gift-box/image-1.png",
  }),
  buildProject({
    name: "Aristotle LLM",
    date: "Summer 2024",
    label: "An attempt to build a LLaMA machine learning model using as few predefined libraries and functions as possible. My friend and I did research into the inner workings of LLMs, took notes and had discussions, and then took a stab at processing a dataset of Aristotle and Plato quotes from Kaggle and writing a model to generate text from a seed string. The model worked with a lot of debugging and some AI assistance, but I could only train it on a few thousand lines due to hardware limitations. Nevertheless, it did produce some wise-sounding lines before starting to repeat gibberish.",
    url: "https://github.com/kimestelle/llm-chatbot.git",
    techStack: { 
      languages: ["Python"],
      frameworks: [],
      libraries: ["PyTorch", "NumPy", "SentencePiece"],
      databases: [],
      platforms: []
    },    
    description: "An attempt to build a LLaMA machine learning model using as few predefined libraries and functions as possible. \n\nMy friend and I did research into the inner workings of LLMs, took notes and had discussions, and then took a stab at processing a dataset of Aristotle and Plato quotes from Kaggle and training a model to generate text from a seed string. \n\nThe model worked with a lot of debugging and some AI assistance, but I could only train it on a few thousand lines over the course of 10+ hours due to hardware limitations and large parameters. Nevertheless, my overtrained Aristotle-bot did produce some wise-sounding lines before starting to repeat gibberish.",
    imageUrls: ["/project-images/4600/image-1.png", "/project-images/4600/image-2.png", "/project-images/4600/image-3.png"],
    cover: "/project-images/4600/image-2.png", 
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
      <a href='/playground'><h4 className='red underline'>stuff I make for fun!</h4></a>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col p-4 shadow-inner rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => handleProjectClick(index)}
          >
            <img
              src={project.cover}
              alt={project.name}
              className="w-full aspect-square object-contain rounded-md mb-3 lazy-load"
              loading="lazy"
            />

            <h3 className="text-lg font-bold">{project.name}</h3>
            <ul className="list-none flex flex-wrap gap-1 items-center mt-2">
                {Object.entries(project.techStack).map(([category, items], index) =>
                (items as string[]).map((item: string, itemIndex: number) => (
                  <li
                  key={`${category}-${itemIndex}`}
                  className={`${colorClasses[index % colorClasses.length]} text-xs shadow-inner p-0.5 px-1.5 rounded-lg`}
                  title={category}
                  >
                  {item}
                  </li>
                ))
                )}
            </ul>
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
