import { fetchAllBlogMeta } from "./localBlog";
import { headers } from "next/headers";
import Link from "next/link";

export default async function BlogListPage() {
  const headersList = await headers(); 
  const fullUrl = headersList.get("x-url") || "";
  const url = new URL(fullUrl || "/", "http://localhost"); 
  const selectedCategory = url.searchParams.get("category");

  const allGroups = await fetchAllBlogMeta();
  const allCategories = [...new Set(allGroups.map((group) => group.category))];

  const filteredGroups = selectedCategory
    ? allGroups.filter((group) => group.category === selectedCategory)
    : allGroups;

  const allPostsSorted = selectedCategory
    ? []
    : allGroups
        .flatMap((group) => group.posts)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="responsive-padding">
      <button>
        <Link href="/">← back to home</Link>
      </button>

      <h2 className="text-3xl font-semibold mt-4">nerd corner -.-</h2>
      <p className="mb-4">noting things i want to remember</p>

      <div className="flex gap-3 flex-wrap mb-6">
        <Link
          href="/blog"
          className={`px-4 py-1 rounded text-sm ${
            !selectedCategory ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          All
        </Link>
        {allCategories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-1 rounded text-sm ${
              selectedCategory === cat ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {selectedCategory ? (
        filteredGroups.map((group) => (
          <div key={group.category} className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{group.category}</h3>
            {group.description && (
              <p className="text-gray-600 mb-4">{group.description}</p>
            )}
            <ul className="space-y-4">
              {group.posts.map((blog) => (
                <li key={blog.slug} className="bg-white p-4 rounded shadow hover:opacity-75">
                  <Link href={`/blog/${blog.category}/${blog.slug}`}>
                    <h4 className="text-xl font-bold">{blog.title}</h4>
                    <p className="text-gray-500">
                      {blog.date} — <span className="italic">{blog.category}</span>
                    </p>
                    <p>{blog.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul className="space-y-4">
          {allPostsSorted.map((blog) => (
            <li
              key={`${blog.category}-${blog.slug}`}
              className="bg-white p-4 rounded shadow hover:opacity-75"
            >
              <Link href={`/blog/${blog.category}/${blog.slug}`}>
                <h4 className="text-xl font-bold">{blog.title}</h4>
                <p className="text-gray-500">
                  {blog.date} — <span className="italic">{blog.category}</span>
                </p>
                <p>{blog.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
