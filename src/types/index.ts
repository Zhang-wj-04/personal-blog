export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  authorId: string;
  categoryIds: string[];
  tagIds: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  postId: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: Date;
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  image?: string;
  role?: "admin" | "user";
}