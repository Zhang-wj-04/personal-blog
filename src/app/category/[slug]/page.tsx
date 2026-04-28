import PostCard from "@/components/blog/PostCard";
import { fileDb } from "@/lib/file-db";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let posts: any[] = [];
  let categoryName = slug;

  try {
    const [categories, allPosts] = await Promise.all([
      fileDb.getCategories(),
      fileDb.getPosts(),
    ]);

    const category = categories.find((c) => c.slug === slug);
    if (category) {
      categoryName = category.name;
      posts = allPosts.filter(
        (p) => p.published && p.categoryIds?.includes(category.id)
      );
    }
  } catch (error) {
    console.error("Failed to fetch category posts:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        分类: {categoryName}
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            该分类下暂无文章
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
