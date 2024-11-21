import { Code } from '../Projects';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CodeBlockProps {
  project: Code;
}

export default function CodeBlock({ project }: CodeBlockProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 3000 })]);

  // Helper function to check if URL is a video file
  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  return (
    <div className='flex flex-col h-[40rem] md:h-[30rem] md:flex-row gap-3 md:gap-5'>
      <span className='absolute red text-[1.5rem] inline-block rotate-90 -mt-8 z-10'>&gt;</span>
      <div className='embla flex-1 h-[40rem] md:h-[30rem]' ref={emblaRef}>
        <div className='embla__container h-full'>
          {project.imageUrls.map((url, index) => (
            <div key={index} className='embla__slide h-full flex justify-center items-center'>
              {isVideo(url) ? (
                <video src={url} controls className='h-full w-auto object-cover' />
              ) : (
                <img src={url} alt={`Project Media ${index + 1}`} className='h-full w-auto object-cover' />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-1 flex-col'>
        <h3 className='leading-snug sm:text-2xl text-lg'>{project.name}</h3>
        <h5 className='mb-2 font-normal'>{project.label} | {project.date}</h5>
        <p className='text-sm'>{project.description}</p>
        <a href={project.url} className='text-sm underline text-red-500' target='_blank' rel='noopener noreferrer'>
          Visit Project
        </a>
        <ol className='list-none flex flex-row gap-1 items-center pt-2'>
          {project.languages.map((language, index) => (
            <li key={index} className='bg-white text-sm p-0.5 px-1.5 mb-1 rounded-lg'>{language}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
