export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: { name: string; slug: string };
  tags?: { name: string; slug: string }[];
  author: { name: string; email: string };
  published: boolean;
  views: number;
  createdAt: string;
}
