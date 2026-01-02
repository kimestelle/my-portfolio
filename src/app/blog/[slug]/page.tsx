'use client';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const postMap: Record<string, any> = {
  'into-the-blue': dynamic(() => import('../pages/into-the-blue')),
  'watercolor-shader': dynamic(() => import('../pages/watercolor-shader')),
  'compressed-thinking': dynamic(() => import('../pages/compressed-thinking')),
  'litter-removal': dynamic(() => import('../pages/litter-removal')),
  'magnet-poetry': dynamic(() => import('../pages/magnet-poetry')),
  'new-portfolio': dynamic(() => import('../pages/new-portfolio')),
  'mood-shader': dynamic(() => import('../pages/mood-shader')),
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const PostComponent = postMap[slug as string];

  if (!PostComponent) return <div>Not found.</div>;

  return (
    <div className="responsive-padding flex justify-center">
      <PostComponent />
    </div>
  );
}
