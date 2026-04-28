import { connectDB, Post, Category } from '@/lib/db';
import CategoryClient from './CategoryClient';

export async function generateStaticParams() {
  try {
    await connectDB();
    const categories = await Category.find().select('slug').lean();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

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

async function getCategory(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    return null;
  }
}

async function getPostsByCategory(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug });
    if (!category) return [];

    const posts = await Post.find({
      category: category._id,
      published: true,
    })
      .populate('author', 'name email')
      .populate('category')
      .populate('tags')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategory(slug),
    getPostsByCategory(slug),
  ]);

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900">分类未找到</h1>
      </div>
    );
  }

  return <CategoryClient category={category} posts={posts} />;
}
