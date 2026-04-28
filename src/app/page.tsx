import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import { fileDb } from "@/lib/file-db";

export default async function HomePage() {
  let posts: any[] = [];

  try {
    const allPosts = await fileDb.getPosts();
    posts = allPosts
      .filter((p) => p.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <div>
      {/* Hero 区域 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mb-12 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl text-blue-100">
            分享技术、生活和思考
          </p>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          最新文章
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              暂无文章，敬请期待！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
