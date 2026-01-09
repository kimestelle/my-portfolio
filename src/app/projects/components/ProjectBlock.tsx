import { useState } from 'react';
import Image from 'next/image';
import { Project } from './projectData';
import LazyVideo from './LazyVideo';

interface ProjectBlockProps {
  project: Project;
}

export default function ProjectBlock({ project }: ProjectBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? project.details.imageUrls.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === project.details.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const isVideo = (url: string) => {
    const u = url.toLowerCase();
    return !u.endsWith(".png") && !u.endsWith(".jpg") && !u.endsWith(".jpeg");
  };

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* header */}
      <div>
        <div className='w-full flex flex-row flex-wrap gap-2 items-end'>
        <h2>{project.name}</h2>
          <div className="h-px flex-1 shrink-1 bg-black/10 mb-2" />
          {
            project.githubUrl && (
              <>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 mb-1"
              >
                <Image src="/icons/gh-logo.svg" alt="GitHub" width={16} height={16} className="mb-1"/>
                <span className="ml-1"> ↗</span>
              </a>
              <div className="h-px w-1 bg-black/10 mb-2" />
              </>
            )
          }
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 mb-1"
            >
              visit ↗
            </a>
          )}
        </div>

        {project.role && (
          <span>{project.role}</span>
        )}
        {project.impact && (
          <h4>{project.impact}</h4>
        )}
      </div>
      {/* overview */}
      <span>{project.details.overview}</span>
      
      <div className="relative w-full h-[22rem] flex justify-center items-center my-5 p-2 rounded-md bg-neutral-100 shadow-inner">
        {isVideo(project.details.imageUrls[currentIndex]) ? (
          <LazyVideo
            playbackId={project.details.imageUrls[currentIndex]}
            className="h-full max-h-[22rem] object-contain"
          />
        ) : (
          <Image
            width={800}
            height={600}
            src={project.details.imageUrls[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="h-full max-h-[22rem] w-auto object-contain"
          />
        )}
        {project.details.imageUrls.length > 1 && (
          <div className='absolute -bottom-3 left-2 flex flex-row gap-1'>
            <button
              onClick={goToPrev}
              className="bg-neutral-400 rounded-sm text-white px-3 shadow"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="bg-neutral-500 rounded-sm text-white px-3 shadow"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* sections */}
      <h3 className="mt-4">
        Key Features & Contributions
      </h3>
      {project.details.sections.map((section, idx) => (
        <details key={idx} className="group glass-card">
          <summary className="cursor-pointer list-none flex flex-row items-center justify-between">
            <h4>{section.title}</h4>
            <span className="text-neutral-400 group-open:rotate-90 transition-transform">›</span>
          </summary>

          <div className="px-2 pt-2">
            <ul className="list-disc list-outside  ml-2 space-y-1.5 text-sm text-neutral-700">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>{item}</li>
              ))}
            </ul>
          </div>
        </details>
      ))}
    
      <div className='flex flex-col gap-2 mt-4'>
      <h3>Tech Stack:</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(project.details.techStack).map(([category, items]) =>
          (items as string[]).map((item, idx) => (
            <span key={`${category}-${idx}`} className="pill">
              {item}
            </span>
          ))
        )}
      </div>
      </div>
    </div>
  );
};