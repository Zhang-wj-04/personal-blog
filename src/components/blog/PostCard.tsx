import Link from "next/link";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string | Date;
}

export default function PostCard({ post }: { post: Post }) {
  const createdAt = new Date(post.createdAt);

  return (
    <Link href={`/posts/${post.slug || post.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* 封面图 */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>
              {format(createdAt, "yyyy年MM月dd日")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
