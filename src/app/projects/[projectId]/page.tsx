import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntoTheBlueCaseStudy from '../../field-notes/into-the-blue/page';
import InternetAtlasCaseStudy from '../../field-notes/internet-atlas/page';
import DigitalLoomCaseStudy from '../case-studies/DigitalLoomCaseStudy';
import TallyCaseStudy from '../case-studies/TallyCaseStudy';
import {
  CASE_STUDY_PROJECT_IDS,
  getPortfolioProject,
} from '../components/projectCopy';

export function generateStaticParams() {
  return CASE_STUDY_PROJECT_IDS.map((projectId) => ({
    projectId,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const project = getPortfolioProject(projectId);

  if (!project || project.variant !== 'featured') return {};

  return {
    title: `${project.name} case study · Estelle Kim`,
    description: project.collapsed.purpose,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getPortfolioProject(projectId);

  if (!project || project.variant !== 'featured') notFound();

  if (projectId === 'into-the-blue') {
    return <IntoTheBlueCaseStudy asProject />;
  }

  if (projectId === 'internet-atlas') {
    return <InternetAtlasCaseStudy asProject />;
  }

  if (projectId === 'digital-loom') {
    return <DigitalLoomCaseStudy />;
  }

  if (projectId === 'tally') {
    return <TallyCaseStudy />;
  }

  notFound();
}
