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

export interface Comment {
  _id: string;
  post: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
}
