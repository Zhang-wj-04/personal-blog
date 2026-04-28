import Link from "next/link";
import { fileDb } from "@/lib/file-db";

export default async function AdminDashboard() {
  let postCount = 0;
  let publishedCount = 0;
  let draftCount = 0;

  try {
    const posts = await fileDb.getPosts();
    postCount = posts.length;
    publishedCount = posts.filter(p => p.published).length;
    draftCount = postCount - publishedCount;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        管理后台
      </h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            总文章数
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {postCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            已发布
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {publishedCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            草稿
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {draftCount}
          </p>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快捷操作
        </h2>
        <div className="space-y-3">
          <Link
            href="/admin/posts/new"
            className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            写新文章
          </Link>
          <Link
            href="/admin/posts"
            className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            管理文章
          </Link>
          <Link
            href="/"
            className="block w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            查看博客
          </Link>
        </div>
      </div>
    </div>
  );
}
