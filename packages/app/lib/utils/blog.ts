import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// In Next.js App Router, we need to use the correct path relative to the project root
// When running from packages/app, the working directory is packages/app
const postsDirectory = path.join(process.cwd(), 'app/blog/posts');

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  views: number;
  tags: string[];
  content: string;
  contentHtml: string;
}

export function getAllPostIds(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md$/, '');
  });
}

export async function getSortedPostsData(): Promise<BlogPost[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Use remark to convert markdown into HTML string
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const contentHtml = processedContent.toString();

      // Combine the data with the id
      return {
        id,
        contentHtml,
        content: matterResult.content,
        ...(matterResult.data as Omit<
          BlogPost,
          'id' | 'content' | 'contentHtml'
        >),
      };
    })
  );

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Blog post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    content: matterResult.content,
    ...(matterResult.data as Omit<BlogPost, 'id' | 'content' | 'contentHtml'>),
  };
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getSortedPostsData();
  return allPosts.filter((post) => post.featured).slice(0, 3);
}

export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  const allPosts = await getSortedPostsData();
  if (category === 'All') {
    return allPosts;
  }
  return allPosts.filter((post) => post.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getSortedPostsData();
  const categories = allPosts.map((post) => post.category);
  return ['All', ...Array.from(new Set(categories))];
}
