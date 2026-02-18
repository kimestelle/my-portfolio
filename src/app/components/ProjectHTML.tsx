'use client';

import {
  type ProjectCategory,
  getCategoryProjects,
} from '../projects/components/projectData';
import ProjectCard from '../projects/components/ProjectCard';

const SECTIONS: { category: ProjectCategory; displayName: string; featured: string[] }[] = [
  { category: 'production experience', displayName: 'deployed at scale', featured: ['into-the-blue', 'sce-data-engineering', 'internet-atlas'] },
  { category: 'production experience', displayName: 'built to last', featured: ['spark-website'] },
  { category: 'graphics & simulation', displayName: 'rendered from scratch', featured: ['mini-minecraft', 'softbody-jelly'] },
  { category: 'creative tools', displayName: 'designed for expression', featured: ['magnetic-poetry', 'textellation'] },
];

function pickById(category: ProjectCategory, ids: string[]) {
  const set = new Set(ids);
  const inCat = getCategoryProjects(category);
  const picked = inCat.filter((p) => set.has(p.id));
  return picked.length ? picked : inCat.slice(0, 2);
}

export default function ProjectHTML() {
  return (
    <section className="w-full mt-8">
      <div className="flex flex-col gap-10">
        {SECTIONS.map(({ displayName, category, featured }) => {
          const selected = pickById(category, featured);

          return (
            <div key={displayName} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <h3>✦ {displayName}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selected.map((p) => {
                  return (
                    <a
                      key={p.id}
                      href={'/projects/#' + p.id}
                    >
                      <ProjectCard project={p} />
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
