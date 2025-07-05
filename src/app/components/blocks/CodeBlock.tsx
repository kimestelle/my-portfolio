import { useState } from "react";
import { Code } from "../Projects";
import Image from "next/image";

interface CodeBlockProps {
  project: Code;
}

export default function CodeBlock({ project }: CodeBlockProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? project.imageUrls.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === project.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const isVideo = (url: string) => {
    return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
  };

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="w-full flex flex-col gap-3">
    <div className="relative w-full h-[22rem] flex justify-center items-center mb-5">
        {isVideo(project.imageUrls[currentIndex]) ? (
          <video
            src={project.imageUrls[currentIndex]}
            preload="none"
              controls
              muted
              playsInline
              autoPlay={!isMobile}
            className="h-full max-h-[22rem] object-contain"
          />
        ) : (
          <Image
            width={800}
            height={600}
            src={project.imageUrls[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="h-full max-h-[22rem] w-auto object-contain"
          />
        )}
                {project.imageUrls.length > 1 && (
          <div className='absolute -bottom-5 left-0 flex flex-row gap-1'>
            <button
              onClick={goToPrev}
              className="bg-red text-white px-3 pb-1 text-lg shadow"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="bg-red text-white px-3 pb-1 text-lg shadow"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h3>{project.name}</h3>
        <h5 className="font-normal">
          {project.date}
          {project.url && (
          <>
            {" | "}
          <a
            href={project.url}
            className="text-sm underline text-red-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Project
          </a>
          </>
          )}
        </h5>
        <p className="text-sm mt-2 split-line pb-4">
          {project.description}
        </p>
      </div>
    </div>
  );
}