// import { getBlogPost, fetchAllBlogMeta } from "../../localBlog";
// import { marked } from "marked";
// import "../../markdown.css";

// export async function generateStaticParams() {
//   const groups = await fetchAllBlogMeta();
//   return groups.flatMap((group) =>
//     group.posts.map((post) => ({
//       category: post.category,
//       slug: post.slug,
//     }))
//   );
// }

// export default async function BlogPostPage({ params }: { params: { category: string; slug: string } }) {
//   const { category, slug } = params;
//   const { meta, content } = await getBlogPost(category, slug);
//   const html = marked(content);

//   return (
//     <div id="markdown" className="responsive-padding">
//       <h1 className="text-3xl font-bold">{meta.title}</h1>
//       <p className="text-gray-500">{meta.date}</p>
//       <p className="text-gray-600 italic">{meta.description}</p>
//       <hr className="my-4" />
//       <div
//         className="prose prose-lg bg-white p-6 rounded shadow"
//         dangerouslySetInnerHTML={{ __html: html }}
//       />
//     </div>
//   );
// }

export default function Page () {
  return (
    <div>coming soon...</div>
  )
}