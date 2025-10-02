'use client'
import { useState, useEffect } from 'react'
import NavBar from "../components/NavBar";
import Link from "next/link";
import MoodRingBackground from "../components/MoodRingShader";

import { allPostsSorted } from "./posts";

export default function BlogListPage() {

  return (
    <div className="responsive-padding">
      <NavBar />

      <h2 className="mt-4">posts</h2>
      <ul className="space-y-4 mb-10">
        {allPostsSorted.map((blog) => (
          <li
            key={blog.slug}
            className="pl-2 border-l border-neutral-200 bg-white/50 hover:opacity-75"
          >
            <Link href={`/blog/${blog.slug}`}>
              <h3>{blog.title}</h3>
              <p> 
                <span className="text-neutral-500 mr-2">
                  {blog.date}
                </span>
              {blog.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="my-4">memos</h2>
      <ul className="space-y-4 mb-10">
        <li className='p-2 bg-yellow-100/50 rounded-lg'>
          fixed rules, open variables, and a shared understanding of how things are allowed to move
        </li>
      </ul>
      <MoodRingBackground />
    </div>
  );
}
