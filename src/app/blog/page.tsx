'use client'
import Link from "next/link";

import { allPostsSorted } from "./posts";
import { ShimmerText } from '../design-deets/text-shimmer/TextShimmer';

export default function BlogListPage() {

  return (
    <main className="responsive-padding flex w-full justify-center">
      <section className="w-full max-w-2xl pb-16">
        <ShimmerText as="h2" className="type-page-title mb-7">
          bits &amp; snippets
        </ShimmerText>

        <ul className="border-y border-[color:var(--line-color)]">
          {allPostsSorted.map((blog) => (
            <li key={blog.slug} className="border-b border-[color:var(--line-color)] last:border-b-0">
              <Link
                href={`/blog/${blog.slug}`}
                className="group block py-4"
              >
                <div className="flex items-baseline justify-between gap-5">
                  <ShimmerText as="h3" className="type-project-title mb-0">
                    {blog.title}
                  </ShimmerText>
                  <span className="type-meta shrink-0 text-[color:var(--text-meta)]">
                    {blog.date}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-5">
                  <p className="text-[color:var(--text-secondary)]">
                    {blog.description}
                  </p>
                  <span
                    aria-hidden
                    className="type-meta shrink-0 text-[color:var(--text-decorative)] transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
                  >
                    ↗
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
