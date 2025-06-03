import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Code } from "../Projects";
import Image from "next/image";

interface CodeBlockProps {
  project: Code;
}

export default function CodeBlock({ project }: CodeBlockProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 3000 })]);

  const isVideo = (url: string) => {
    return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
  };

  return (
    <div className="flex flex-col w-full pt-[4rem]">
      <div className="embla flex-1 md:h-[32rem]" ref={emblaRef}>
        <div className="embla__container h-full">
          {project.imageUrls.map((url, index) => (
            <div key={index} className="embla__slide h-full flex justify-start items-center">
              {isVideo(url) ? (
                <video src={url} controls className="h-full w-auto object-contain lazy-load" preload="metadata" />
              ) : (
                  <Image
                    src={url}
                    alt={`Project Media ${index + 1}`}
                    className="h-full w-auto object-contain lazy-load"
                    width={200} 
                    height={200}
                    style={{ objectFit: 'contain' }} 
                  />
              )}
            </div>
          ))}
        </div>
      </div>
        <h3 className="mt-5">{project.name}</h3>
        <h5 className="font-normal">
          {project.date} |{" "}
          <a
            href={project.url}
            className="text-sm underline text-red-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Project
          </a>
        </h5>
        <p className="text-sm pt-3 pb-10 split-line">
          {project.description}
        </p>
    </div>
  );
}
