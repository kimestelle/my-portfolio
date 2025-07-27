'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const postMap: Record<string, any> = {
  'compressed-thinking': dynamic(() => import('../pages/compressed-thinking')),
  'litter-removal': dynamic(() => import('../pages/litter-removal')),
  'magnet-poetry': dynamic(() => import('../pages/magnet-poetry')),
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const PostComponent = postMap[slug as string];

  if (!PostComponent) return <div>Not found.</div>;

  return (
    <div className="responsive-padding">
      <Link href="/blog" className="red">
        ← Back to blog
      </Link>
      <PostComponent />
    </div>
  );
}
