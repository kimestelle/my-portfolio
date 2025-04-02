import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogMeta {
  category: string;
  slug: string;
  title: string;
  date: string;
  description: string;
}

export interface BlogCategoryGroup {
  category: string;
  description?: string;
  posts: BlogMeta[];
}


const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export const fetchAllBlogMeta = async (): Promise<BlogCategoryGroup[]> => {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const categories = fs.readdirSync(CONTENT_DIR);
  const groupedPosts: BlogCategoryGroup[] = [];

  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    // Read optional category description
    let description = "";
    const descriptionPath = path.join(categoryPath, "description.txt");
    if (fs.existsSync(descriptionPath)) {
      description = fs.readFileSync(descriptionPath, "utf8").trim();
    }

    const posts: BlogMeta[] = [];
    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.endsWith(".md")) continue;

      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      posts.push({
        category,
        slug: encodeURIComponent(file.replace(/\.md$/, "")),
        title: data.title || file.replace(/\.md$/, ""),
        date: data.date || "1970-01-01",
        description: data.description || "",
      });
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    groupedPosts.push({
      category,
      description,
      posts,
    });
  }

  return groupedPosts;
};


export const getBlogPost = async (category: string, slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(CONTENT_DIR, category, `${decodedSlug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Blog post not found: ${category}/${slug}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return { meta: data, content };
};
