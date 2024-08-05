import { Code } from '../Projects';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'

interface CodeBlockProps {
  project: Code;
}

export default function CodeBlock({ project }: CodeBlockProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({playOnInit: true, delay: 3000})])

  return (
        <div className='flex flex-col md:flex-row gap-3 md:gap-5'>
            <div className="embla flex-1" ref={emblaRef}>
                <div className="embla__container">
                {project.imageUrls.map((url, index) => (
                    <div key={index} className='embla__slide'>
                    <img src={url} alt={`Project Image ${index + 1}`} className='w-full h-auto object-contain' />
                    </div>
                ))}
                </div>
            </div>
            <div className='flex flex-1 flex-col'>
                <h3 className='leading-snug sm:text-2x text-lg'>{project.name}</h3>
                <h5 className=' mb-2 font-normal'>{project.label} | {project.date}</h5>
                <p className='text-sm'>{project.description}</p>
                <a href={project.url} className='text-sm underline text-red-500' target="_blank" rel="noopener noreferrer">
                    Visit Project
                </a>
                <ol className='list-none flex flex-row gap-1 items-center pt-2'>
                {project.languages.map((language, index) => (
                    <li key={index} className='md:bg-white bg-gray-200 p-0.5 px-1.5 mb-1 rounded-lg'>{language}</li>
                ))}
                </ol>
            </div>
        </div>
  );
}
