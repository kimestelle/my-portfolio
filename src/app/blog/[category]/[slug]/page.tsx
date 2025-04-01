import { getBlogPost, fetchAllBlogMeta } from "../../localBlog";
import { marked } from "marked";
import "../../markdown.css"

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const blogs = await fetchAllBlogMeta();
  return blogs.map((b) => ({
    category: b.category,
    slug: b.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const { meta, content } = getBlogPost(category, slug);
  const html = marked(content);

  return (
    <div id="markdown" className="responsive-padding">
      <h1 className="text-3xl font-bold">{meta.title}</h1>
      <p className="text-gray-500">{meta.date}</p>
      <p className="text-gray-600 italic">{meta.description}</p>
      <hr className="my-4" />
      <div
        className="prose prose-lg bg-white p-6 rounded shadow"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
