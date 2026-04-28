import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import CategoryClient from './CategoryClient';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  const posts = getPostsByCategory(slug);

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">分类未找到</h1>
      </div>
    );
  }

  return <CategoryClient category={category} posts={posts} />;
}
