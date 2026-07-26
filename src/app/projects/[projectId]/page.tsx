import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectBlock from '../components/ProjectBlock';
import {
  FEATURED_PROJECT_IDS,
  getPortfolioProject,
} from '../components/projectCopy';

export function generateStaticParams() {
  return FEATURED_PROJECT_IDS.map((projectId) => ({
    projectId,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getPortfolioProject(projectId);

  if (!project || project.variant !== 'featured') notFound();

  return (
    <main className="responsive-padding flex w-full justify-center pb-20">
      <div className="w-full max-w-4xl pt-8">
        <Link
          href={`/projects#${project.id}`}
          className="mb-8 inline-block text-sm text-neutral-600"
        >
          ← selected work
        </Link>
        <ProjectBlock project={project} />
      </div>
    </main>
  );
}
