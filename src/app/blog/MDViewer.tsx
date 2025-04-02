"use client";

import { marked } from "marked";
import { useMemo } from "react";

export default function MDViewer({ markdown }: { markdown: string }) {
  const html = useMemo(() => marked(markdown), [markdown]);

  return (
    <div
      className="prose prose-lg bg-white p-6 rounded"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
