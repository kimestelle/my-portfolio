import { Project } from '../Projects';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay'

interface ProjectBlockProps {
  project: Project;
}

export default function ProjectBlock({ project }: ProjectBlockProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({playOnInit: true, delay: 3000})])

  return (
    <div id='course-container' className='flex flex-grow flex-col gap-2 p-4 shadow-inner rounded-lg red-radial-gr'>
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
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>{project.date}</p>
                <p>{project.label}</p>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                    Visit Project
                </a>
                <ul>
                    {project.languages.map((language, index) => (
                    <li key={index}>{language}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
}
