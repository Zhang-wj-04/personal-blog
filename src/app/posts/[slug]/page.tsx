import { connectDB, Post, Comment } from '@/lib/db';
import PostDetailClient from './PostDetailClient';

interface Post {
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

interface Comment {
  _id: string;
  post: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
}

async function getPost(slug: string) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'name email')
      .populate('category')
      .populate('tags')
      .lean();

    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getComments(postId: string) {
  try {
    await connectDB();
    const comments = await Comment.find({ post: postId, approved: true })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    return [];
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900">文章未找到</h1>
      </div>
    );
  }

  const comments = await getComments(post._id);

  return <PostDetailClient post={post} initialComments={comments} />;
}
