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
    <div className="flex flex-col gap-3">
    <div className="embla max-h-[22rem] h-full" ref={emblaRef}>
      <div className="embla__container h-full max-h-[22rem]">
        {project.imageUrls.map((url, index) => (
          <div
            key={index}
            className="embla__slide h-full max-h-[22rem] flex justify-center items-center"
          >
            {isVideo(url) ? (
              <video
                src={url}
                autoPlay
                className="h-full max-h-[22rem] object-contain"
              />
            ) : (
              <Image
                width={800}
                height={600}
                src={url}
                alt={`Slide ${index}`}
                className="h-full max-h-[22rem] w-auto object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>

      <div className="flex flex-1 flex-col">
        <h3>{project.name}</h3>
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
        <p className="text-sm h-[9rem] mt-2 split-line">
          {project.description}
        </p>
      </div>
    </div>
  );
}