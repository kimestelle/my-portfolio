"use client";

import { marked } from "marked";
import matter from "gray-matter";
import { useState, useEffect, useMemo } from "react";
import "./markdown.css";

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export default function BlogPostPage(props: Props) {
  const { category, slug } = props.params;
  const blogPath = `${category}/${slug}.md`;

  const [readmeContent, setReadmeContent] = useState<string>("");
  const [meta, setMeta] = useState<{ title: string; date: string; description: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const renderer = useMemo(() => {
    const newRenderer = new marked.Renderer();
    newRenderer.image = () => "";
    return newRenderer;
  }, []);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const apiUrl = `https://raw.githubusercontent.com/kimestelle/my-blog/main/${blogPath}`;
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/vnd.github.v3.raw",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const markdown = await response.text();

        // Extract metadata using gray-matter
        const { content, data } = matter(markdown);
        setMeta({
          title: data.title || "Untitled",
          date: data.date || "Unknown date",
          description: data.description || "",
        });

        const htmlContent = marked(content, { renderer, async: false });
        setReadmeContent(htmlContent);
      } catch (error) {
        console.error(error);
        setReadmeContent("<p>Failed to load blog content.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [blogPath, renderer]);

  return (
    <div className="w-full text-white">
      {loading ? (
        <p className="text-center mt-20">Loading blog...</p>
      ) : (
        <>
          {meta && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{meta.title}</h1>
              <p className="text-gray-400">{meta.date}</p>
              <p className="text-gray-300">{meta.description}</p>
            </div>
          )}
          <div
            id="markdown"
            className="prose prose-lg w-full text-black bg-white p-6 rounded-lg shadow-md"
            dangerouslySetInnerHTML={{ __html: readmeContent }}
          />
        </>
      )}
    </div>
  );
}
