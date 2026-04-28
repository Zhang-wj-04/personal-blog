import { connectDB, Post, Category, Tag } from '@/lib/db';
import PostsClient from './PostsClient';

interface Post {
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
  updatedAt: string;
}

async function getPosts() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true })
      .populate('author', 'name email')
      .populate('category')
      .populate('tags')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    return [];
  }
}

async function getTags() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(tags));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const [posts, categories, tags] = await Promise.all([
    getPosts(),
    getCategories(),
    getTags(),
  ]);

  return (
    <PostsClient
      initialPosts={posts}
      categories={categories}
      tags={tags}
    />
  );
}
