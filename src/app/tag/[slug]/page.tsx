import { connectDB, Post, Tag } from '@/lib/db';
import TagClient from './TagClient';

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
}

async function getTag(slug: string) {
  try {
    await connectDB();
    const tag = await Tag.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(tag));
  } catch (error) {
    return null;
  }
}

async function getPostsByTag(slug: string) {
  try {
    await connectDB();
    const tag = await Tag.findOne({ slug });
    if (!tag) return [];

    const posts = await Post.find({
      tags: tag._id,
      published: true,
    })
      .populate('author', 'name email')
      .populate('category')
      .populate('tags')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tag, posts] = await Promise.all([
    getTag(slug),
    getPostsByTag(slug),
  ]);

  if (!tag) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900">标签未找到</h1>
      </div>
    );
  }

  return <TagClient tag={tag} posts={posts} />;
}
