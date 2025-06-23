"use client";

import { useState } from "react";
import CodeBlock from "../components/blocks/CodeBlock";
// import Image from "next/image";

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
    description: "OpenGL Minecraft simulation, all components of the rendering pipeline built from scratch. Final team project for CIS4600.\n\nMy Contributions:\n\nTerrain Rendering and Chunking:\n  - Designed a system to optimize infinite terrain rendering by dynamically loading and unloading visible chunks based on the player’s position.\n  - Developed interleaved Vertex Buffer Objects (VBOs) to efficiently store and render chunk geometry, ensuring only visible faces were processed, reducing GPU load.\n\nTexture Mapping and Animation:\n  - Mapped block textures with UV coordinates, including distinct faces for blocks like grass (top, sides, bottom).\n  - Implemented animated textures for water and lava using time-dependent transformations, creating smooth, looping motions.\n\nDynamic Sky:\n  - Built a GLSL sky shader featuring:\n    - A procedurally animated day-night cycle with moving sun and halo.\n    - Procedural clouds using Worley noise-based fractional Brownian motion.\n\nFluid Surface Waves and Reflection:\n  - Dynamically displaced water geometry to create realistic wave motion.\n  - Recalculated normals in the vertex shader to accurately reflect light on moving surfaces.\n  - Enhanced light reflections with Blinn-Phong highlights.",
    imageUrls: ["/project-images/minecraft/mc-demo.mp4"],
    cover: '/project-images/covers/minecraft-cover.png'
  }),
  buildProject({
    name: "Into the Blue Museum Experience",
    date: "Spring 2025",
    label: "",
    url: "https://penn.museum/sites/blue/welcome/",
    techStack: {
      languages: ["TypeScript"],
      frameworks: ["NextJS"],
      libraries: ["React"],
      databases: [],
      platforms: [],
    },
    description: "Virtual experience built and maintained for a 9-month-long feature at the Penn Museum, delivered under an 8-week deadline."
    + "\n\nMy Contributions:\n\n" +
    "IndexedDB Data Storage:\n" +
    "  - Proposed using IndexedDB when faced with the problem of storing various forms of user data online, allowing the site to function like an app with the convenience of a frontend-only website.\n" +
    "\nSticker Generation and Sharing Pipeline:\n" +
    "  - Designed and built core feature to capture webcam input, clip it along varying SVG paths with an animated cutting effect, apply a sticker-style outline, and store one sticker image per object in IndexedDB.\n" +
    "\nDrag-&-Drop Stickerboard:\n" +
    "  - Created a stickerboard interface with draggable stickers, modals, and rasterizing compositions as shareable PNGs\n",
    imageUrls: ["/project-images/into-the-blue/image-1.png"],
    cover: '/project-images/covers/museum-cover.png'
  }),
  buildProject({
    name: "Internet Atlas",
    date: "Spring 2025",
    label: "Client project migrating and rebranding RoboRacer's website.",
    url: "https://the-internet-atlas.com/",
    techStack: {
      languages: ["TypeScript"],
      frameworks: ["Vite", "WebGL"],
      libraries: ["React", "FastAPI"],
      databases: ["Supabase"],
      platforms: [],
    },
    description: "Description and full live deployment coming soon...",
    imageUrls: ['/project-images/covers/atlas-cover.png'],
    cover: '/project-images/covers/atlas-cover.png'
  }),
  buildProject({
    name: "Better-Spelling-Bee",
    date: "Summer 2024",
    label: "Full-stack web app",
    url: "https://github.com/kimestelle/better-spelling-bee",
    techStack: {
      languages: ["TypeScript", "Python"],
      frameworks: ["Next.js", "Django"],
      libraries: ["React"],
      databases: ["PostgreSQL"],
      platforms: ["Figma"],
    },
    description: "My friend and I remade our favorite mobile game (NYT Spelling Bee!), focusing on enhancing user engagement through dynamic interactions and personalized features.\n" +
  "\nDesign:\n" +
  "- Minimal and responsive web interface incorporating subtle animations.\n" +
  "- Playful, tangible draggable objects including letter blocks and avatars.\n" +
  "\nDevelopment:\n" +
  "- Complex state management, caching during gameplay sessions.\n" +
  "- JWT token management for user auth and session persistence.\n" +
  "- Efficient system to source a dictionary subset from 7 letters including 1+ pangrams from a subset by processing, sorting, and indexing a 46,444 word dictionary\n" +
  "- Drag-and-drop ducks, clonning onto words and reordering dynamically with CSS gymnastics and npm libraries.\n" +
  "\nNext Steps:\n" +
  "- Deploy site\n" +
  "- Recover some animations gone MIA after restructuring app (ducks in pond randomly flapping, fly and sink animations upon entering word).\n",
    imageUrls: [
      "/project-images/better-spelling-bee/bsb-demo.mp4",
      "/project-images/better-spelling-bee/image-1.png",
      "/project-images/better-spelling-bee/image-2.png",
    ],
    cover: "/project-images/covers/spellingbee-cover.png",
  }),
  buildProject({
    name: "Advanced Raytracing in C++",
    date: "Spring 2025",
    label: "Client project migrating and rebranding RoboRacer's website.",
    url: "",
    techStack: {
      languages: ["C++", "GLSL"],
      frameworks: [],
      libraries: [],
      databases: [],
      platforms: ["OpenGL"],
    },
    description: "Implemented real-time 3D rendering pipelines using modern OpenGL and GLSL in C++. Built a mesh viewer supporting OBJ parsing, normal visualization, interactive camera controls, and scene graph hierarchies. Developed a deferred shading renderer with G-buffer composition (albedo, normal, depth, material masks), screen-space reflection, and physically-based lighting (Cook-Torrance BRDF). Integrated post-processing effects (e.g. Gaussian blur, tone mapping), matcap shading, and sky models (Hosek-Wilkie). Applied shader-based ray marching, subsurface scattering, and domain repetition using signed distance fields (SDFs).",
    imageUrls: ['/project-images/covers/461-cover.png'],
    cover: '/project-images/covers/461-cover.png'
  }),
  buildProject({
    name: "Eat or Plant?",
    date: "Spring 2025",
    label: "Client project migrating and rebranding RoboRacer's website.",
    url: "",
    techStack: {
      languages: ["C++"],
      frameworks: ["Arduino"],
      libraries: [],
      databases: [],
      platforms: [],
    },
    description: "Description coming soon...",
    imageUrls: ['/project-images/covers/chocolate-cover.png'],
    cover: '/project-images/covers/chocolate-cover.png'
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
    description:"As someone who loves writing handwritten letters but lives far from most of my loved ones, I wanted to capture the warmth, spontaneity, and joy of receiving a handwritten note through a simple shareable website.\n\n" + 
    "- Custom font from my own handwriting and hand-drawn graphics\n" +
    "- 2D physics engine that explodes from an animated gift box to evoke a sense of physical space\n\n" +
    " To create a seamless experience (since opening gifts should never be a task) while ensuring each person's information is secure, I stored unique IDs in the URL route directly sent to recipients to retrieve Firebase documents, all it takes to open is clicking a secure link sent via text.",
    imageUrls: [
      "/project-images/gift-box/giftbox-demo.mp4",
      "/project-images/gift-box/image-1.png",
      "/project-images/gift-box/image-2.png",
    ],
    cover: "/project-images/covers/giftbox-cover.png",
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
    description: "An attempt to build a LLaMA machine learning model using as few predefined libraries and functions as possible. \n\nMy friend and I did research into the mathematical workings of LLMs, took notes and had discussions, and then took a stab at processing a dataset of Aristotle and Plato quotes from Kaggle and training a model to generate text from a seed string. \n\nThe model worked with a lot of debugging and some AI assistance, but I could only train it on a few thousand lines over the course of 10+ hours due to hardware limitations and large parameters. Nevertheless, my overtrained Aristotle-bot did produce some wise-sounding lines before starting to repeat gibberish.",
    imageUrls: ["/project-images/4600/image-1.png", "/project-images/4600/image-2.png", "/project-images/4600/image-3.png"],
    cover: "/project-images/covers/llm-cover.png", 
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
    <div id='projects' className="flex flex-col gap-5 px-10 md:px-32 py-32">
      {/* <div className='w-full h-10 flex flex-row gap-2 justify-center items-center'>

      </div> */}
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
              className="w-full object-contain rounded-md mb-3 lazy-load"
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
        <div className="fixed flex flex-col  gap-5 inset-0 bg-black bg-opacity-50 px-10 flex justify-center items-center z-50">
          <div className="w-full flex flex-col items-end h-[80svh] overflow-y-scroll bg-white rounded-lg max-w-3xl p-6 py-10 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closePopup}
            >
              ✕
            </button>
            <CodeBlock project={projects[activeProjectIndex]} />
          </div>
            <div className="w-full gap-3 flex justify-center">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={goToPreviousProject}
              >
                &lt;
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={goToNextProject}
              >
                &gt;
              </button>
            </div>
        </div>
      )}
    </div>
  );
}