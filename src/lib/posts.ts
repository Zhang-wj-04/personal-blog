import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category?: { name: string; slug: string };
  tags?: { name: string; slug: string }[];
  author: { name: string; email: string };
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        _id: slug,
        title: data.title || '',
        slug: data.slug || slug,
        content: content,
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || '',
        category: data.category ? { name: data.category, slug: data.category } : undefined,
        tags: data.tags ? data.tags.map((tag: string) => ({ name: tag, slug: tag })) : [],
        author: { name: 'Admin', email: 'admin@example.com' },
        published: data.published !== false,
        views: 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.createdAt || new Date().toISOString(),
      };
    });

  return allPostsData
    .filter((post) => post.published)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      _id: slug,
      title: data.title || '',
      slug: data.slug || slug,
      content: content,
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      category: data.category ? { name: data.category, slug: data.category } : undefined,
      tags: data.tags ? data.tags.map((tag: string) => ({ name: tag, slug: tag })) : [],
      author: { name: 'Admin', email: 'admin@example.com' },
      published: data.published !== false,
      views: 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

export function getAllCategories(): Category[] {
  const posts = getAllPosts();
  const categories = new Map<string, Category>();

  posts.forEach((post) => {
    if (post.category && !categories.has(post.category.slug)) {
      categories.set(post.category.slug, {
        _id: post.category.slug,
        name: post.category.name,
        slug: post.category.slug,
      });
    }
  });

  return Array.from(categories.values());
}

export function getPostsByCategory(categorySlug: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category?.slug === categorySlug);
}

export function getAllTags(): Tag[] {
  const posts = getAllPosts();
  const tags = new Map<string, Tag>();

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (!tags.has(tag.slug)) {
          tags.set(tag.slug, {
            _id: tag.slug,
            name: tag.name,
            slug: tag.slug,
          });
        }
      });
    }
  });

  return Array.from(tags.values());
}

export function getPostsByTag(tagSlug: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags?.some((tag) => tag.slug === tagSlug));
}
