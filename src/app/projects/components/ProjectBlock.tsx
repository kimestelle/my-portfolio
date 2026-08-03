'use client';

import Image from 'next/image';
import { useState } from 'react';
import LazyVideo from './DeferredLazyVideo';
import type { PortfolioProject } from './projectCopy';

type ProjectBlockProps = {
  project: PortfolioProject;
};

const isMuxVideo = (url: string) => !url.includes('/') && !url.includes('.');

export default function ProjectBlock({ project }: ProjectBlockProps) {
  const [mediaReady, setMediaReady] = useState(false);
  const { story } = project;

  return (
    <article className="w-full">
      <header>
        <div className="flex flex-wrap items-end gap-2">
          <h1>{project.name}</h1>
          <div className="mb-2 h-px min-w-8 flex-1 bg-[color:var(--line-color)]" />
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              source ↗
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              visit ↗
            </a>
          )}
        </div>

        <p className="type-lead mt-3 max-w-2xl">
          {project.collapsed.purpose}
        </p>

        <div className="mt-5 grid gap-4 border-y border-[color:var(--line-color)] py-4 sm:grid-cols-2 sm:gap-8">
          <div>
            <h4 className="text-neutral-500">my role</h4>
            <p className="mt-1">{project.metadata.role}</p>
            {project.metadata.team && (
              <>
                <h4 className="mt-4 text-neutral-500">team</h4>
                <p className="mt-1">{project.metadata.team}</p>
              </>
            )}
          </div>
          <div>
            <h4 className="text-neutral-500">date</h4>
            <p className="mt-1">{project.metadata.date}</p>
            <h4 className="mt-4 text-neutral-500">result</h4>
            <p className="mt-1">{project.metadata.result}</p>
          </div>
        </div>
      </header>

      {project.media && (
        <div className="ui-radius-panel relative my-5 aspect-video w-full overflow-hidden bg-neutral-950 shadow-inner">
          <Image
            src={project.media.cover}
            alt={`${project.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
          {project.media.preview && isMuxVideo(project.media.preview) && (
            <div
              className={`absolute inset-0 transition-opacity duration-[var(--motion-mood-duration)] ease-[var(--motion-mood-ease)] ${
                mediaReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <LazyVideo
                playbackId={project.media.preview}
                poster=""
                muted
                loop
                active
                preload="auto"
                maxResolution="1080p"
                objectFit="contain"
                onReady={() => setMediaReady(true)}
                className="h-full w-full bg-neutral-950 object-contain"
              />
            </div>
          )}
        </div>
      )}

      {project.status && (
        <p className="text-neutral-500">{project.status}</p>
      )}

      <section className="mt-8">
        <h3>the goal</h3>
        <p>{story.goal}</p>
      </section>

      <section className="mt-8">
        <h3>my role</h3>
        <p>{story.role ?? project.metadata.role}</p>
        {(story.owned?.length || story.workedWith?.length) && (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {story.owned && (
              <div>
                <h4>owned</h4>
                <ul className="project-story-list type-body mt-2 space-y-1 text-[color:var(--text-secondary)]">
                  {story.owned.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {story.workedWith && (
              <div>
                <h4>worked with</h4>
                <ul className="project-story-list type-body mt-2 space-y-1 text-[color:var(--text-secondary)]">
                  {story.workedWith.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h3>biggest challenge</h3>
        <p>{story.challenge}</p>
      </section>

      <section className="mt-8">
        <h3>one decision that mattered</h3>
        <p>{story.decision}</p>
      </section>

      <section className="mt-8">
        <h3>the outcome</h3>
        <p>{story.outcome}</p>
      </section>

      <section className="mt-8">
        <h3>what changed my mind</h3>
        <p>{story.changedMind}</p>
      </section>

      <div className="type-meta mt-8 border-t pt-4 text-[color:var(--text-decorative)]">
        {project.metadata.stack}
      </div>
    </article>
  );
}
