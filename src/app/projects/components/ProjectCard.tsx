import Image from 'next/image';
import { Project } from './projectData';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <figure className="group relative overflow-hidden rounded-xl border bg-white/60 backdrop-blur">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
        <Image
          src={project.cover.imageSrc}
          alt={project.name}
          width={1000}
          height={625}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-white/45 via-white/0 to-white/0" />
      </div>

      <figcaption className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium leading-snug truncate">{project.name}</div>
            <div className="text-sm text-neutral-600 leading-snug line-clamp-2">
              {project.cover.blurb}
            </div>
          </div>
          <span className="shrink-0 text-neutral-400 group-hover:text-neutral-700 transition-colors">
            ↗
          </span>
        </div>

        {project.cover.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.cover.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {project.cover.engineering ? (
          <p className="mt-2 text-[12px] text-neutral-600 leading-snug line-clamp-2">
            {project.cover.engineering}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}