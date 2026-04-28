import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// 确保数据目录存在
async function ensureDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 读取 JSON 文件
async function readCollection<T>(name: string): Promise<T[]> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

// 写入 JSON 文件
async function writeCollection<T>(name: string, data: T[]): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// 生成简单 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  categoryIds: string[];
  tagIds: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export const fileDb = {
  // Posts
  async getPosts(): Promise<Post[]> {
    return readCollection<Post>("posts");
  },

  async getPostById(id: string): Promise<Post | null> {
    const posts = await readCollection<Post>("posts");
    return posts.find((p) => p.id === id) || null;
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    const posts = await readCollection<Post>("posts");
    return posts.find((p) => p.slug === slug) || null;
  },

  async createPost(data: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
    const posts = await readCollection<Post>("posts");
    const now = new Date().toISOString();
    const newPost: Post = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    posts.push(newPost);
    await writeCollection("posts", posts);
    return newPost;
  },

  async updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
    const posts = await readCollection<Post>("posts");
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    posts[index] = {
      ...posts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await writeCollection("posts", posts);
    return posts[index];
  },

  async deletePost(id: string): Promise<boolean> {
    const posts = await readCollection<Post>("posts");
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length === posts.length) return false;
    await writeCollection("posts", filtered);
    return true;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return readCollection<Category>("categories");
  },

  async createCategory(data: Omit<Category, "id">): Promise<Category> {
    const categories = await readCollection<Category>("categories");
    const newCategory: Category = { ...data, id: generateId() };
    categories.push(newCategory);
    await writeCollection("categories", categories);
    return newCategory;
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    return readCollection<Tag>("tags");
  },

  async createTag(data: Omit<Tag, "id">): Promise<Tag> {
    const tags = await readCollection<Tag>("tags");
    const newTag: Tag = { ...data, id: generateId() };
    tags.push(newTag);
    await writeCollection("tags", tags);
    return newTag;
  },

  // Comments
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const comments = await readCollection<Comment>("comments");
    return comments.filter((c) => c.postId === postId);
  },

  async createComment(data: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const comments = await readCollection<Comment>("comments");
    const newComment: Comment = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    await writeCollection("comments", comments);
    return newComment;
  },

  async deleteComment(id: string): Promise<boolean> {
    const comments = await readCollection<Comment>("comments");
    const filtered = comments.filter((c) => c.id !== id);
    if (filtered.length === comments.length) return false;
    await writeCollection("comments", filtered);
    return true;
  },
};
