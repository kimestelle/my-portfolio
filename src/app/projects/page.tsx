"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectBlock from "./components/ProjectBlock";
import ProjectCard from "./components/ProjectCard";
import {
  PROJECTS,
  type Project,
  type ProjectCategory,
} from "../projects/components/projectData";

const CATEGORIES: ProjectCategory[] = [
  "production experience",
  "graphics & simulation",
  "creative tools",
  // "technical explorations",
];

export default function Projects() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  //flat lst of projects grouped by category
  const orderedProjects: Project[] = useMemo(() => {
    const byCat = new Map<ProjectCategory, Project[]>();
    for (const cat of CATEGORIES) byCat.set(cat, []);
    for (const p of PROJECTS) byCat.get(p.category)!.push(p);

    return CATEGORIES.flatMap((cat) => byCat.get(cat)!);
  }, []);

  // grouped projects for views
  const grouped: Record<ProjectCategory, Project[]> = useMemo(() => {
    const out: Record<ProjectCategory, Project[]> = {
      "production experience": [],
      "graphics & simulation": [],
      "creative tools": [],
      // "technical explorations": [],
    };
    for (const p of PROJECTS) out[p.category].push(p);
    return out;
  }, []);

  const handleProjectClick = (index: number) => setActiveProjectIndex(index);
  const closePopup = () => setActiveProjectIndex(null);

  const goToNextProject = () => {
    if (activeProjectIndex !== null) {
      setActiveProjectIndex((prev) => ((prev ?? 0) + 1) % orderedProjects.length);
    }
  };

  const goToPreviousProject = () => {
    if (activeProjectIndex !== null) {
      setActiveProjectIndex((prev) =>
        prev! === 0 ? orderedProjects.length - 1 : prev! - 1
      );
    }
  };

  const prevName =
    activeProjectIndex === null
      ? ""
      : orderedProjects[(activeProjectIndex - 1 + orderedProjects.length) % orderedProjects.length].name;

  const nextName =
    activeProjectIndex === null
      ? ""
      : orderedProjects[(activeProjectIndex + 1) % orderedProjects.length].name;

  return (
    <div className="flex flex-col responsive-padding justify-center items-center">
      <div className="flex flex-col w-full max-w-6xl">
        <div className='w-full flex flex-row justify-between items-center mb-6'>
          <button
            className="glass-card w-fit"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? "switch to list view" : "switch to grid view"}
          </button>

          <Link 
            href="/playground"
          >
            playground →
          </Link>
        </div>

      {viewMode === "grid" ? (
        <>
          <div className="flex flex-col gap-10">
            {CATEGORIES.map((cat) => {
              const list = grouped[cat];

              return (
                <div key={cat} className="flex flex-col gap-3 mt-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3>{cat}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {list.map((project) => {
                      const modalIndex = orderedProjects.findIndex((p) => p.id === project.id);
                      return (
                        <div
                          key={project.id}
                          id={project.id}
                          className="cursor-pointer"
                          onClick={() => handleProjectClick(modalIndex)}
                        >
                          <ProjectCard project={project} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {activeProjectIndex !== null && (
            <div className="fixed flex flex-col inset-0 bg-white/50 backdrop-blur-md px-10 flex justify-center items-center z-50">
              <div className="w-full h-px relative max-w-3xl gap-[1px] flex justify-end z-[51]">
                <button
                  className="absolute text-2xl top-3 right-6 text-red-500 hover:text-red-200"
                  onClick={closePopup}
                >
                  &times;
                </button>
              </div>

              <div className="w-full scrollbar-small flex flex-col items-end h-[80svh] overflow-y-scroll bg-white rounded-t-lg max-w-3xl p-6 md:pt-10 relative">
                <ProjectBlock project={orderedProjects[activeProjectIndex]} />
              </div>

              <div className="w-full max-w-3xl gap-[1px] flex justify-center">
                <button
                  className="group w-full px-4 py-1 bg-neutral-800 rounded-bl-lg hover:bg-neutral-500"
                  onClick={goToPreviousProject}
                >
                  <span className="text-white group-hover:hidden">{"< "}</span>
                  <span className="text-white hidden group-hover:inline-block max-w-full align-middle truncate">
                    {prevName}
                  </span>
                </button>

                <button
                  className="group w-full px-4 py-1 text-white bg-neutral-800 rounded-br-lg hover:bg-neutral-500"
                  onClick={goToNextProject}
                >
                  <span className="text-white group-hover:hidden">{" >"}</span>
                  <span className="text-white hidden group-hover:inline-block max-w-full align-middle truncate">
                    {nextName}
                  </span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="relative flex flex-col -mt-10">
          {CATEGORIES.map((cat) => (
            <div key={cat} id={cat} className="flex flex-col">
              {grouped[cat].map((project) => {
                const modalIndex = orderedProjects.findIndex((p) => p.id === project.id);
                return (
                  <div
                    key={project.id}
                    id={project.id}
                    className="pt-20"
                    onClick={() => handleProjectClick(modalIndex)}
                  >
                    <ProjectBlock project={project} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
