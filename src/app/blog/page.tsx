'use client'
import Link from "next/link";

import { allPostsSorted } from "./posts";

export default function BlogListPage() {

  return (
    <div className="responsive-padding flex flex-col">
        <div className="mb-2 mt-6 flex items-center gap-3">
        <h4>
            {'<posts/>'}
        </h4>
        <div className="h-px flex-1 bg-black/10" />
        </div>
      <ul className="space-y-4 mb-10">
        {allPostsSorted.map((blog) => (
          <li
            key={blog.slug}
            className="glass-card"
          >
            <Link href={`/blog/${blog.slug}`}>
              <h5>{blog.title}</h5>
              <span> 
                <span className="mr-2">
                  {blog.date}
                </span>
              {blog.description}</span>
            </Link>
          </li>
        ))}
      </ul>

        <div className="mb-2 flex items-center gap-3">
        <h4>
            {'<memos/>'}
        </h4>
        <div className="h-px flex-1 bg-black/10" />
        </div>
      <ul className="space-y-4 mb-10">
        <li className='p-2 px-3 bg-yellow-100/50 rounded-lg'>
          fixed rules, open variables, and a shared understanding of how things are allowed to move
        </li>
      </ul>
    </div>
  );
}
