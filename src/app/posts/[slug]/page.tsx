import ReactMarkdown from "react-markdown";
import CommentSection from "@/components/blog/CommentSection";
import { fileDb } from "@/lib/file-db";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  let post: any = null;
  let error = "";

  try {
    post = await fileDb.getPostBySlug(slug);

    if (!post) {
      error = "文章未找到";
    }
  } catch (err) {
    error = "获取文章失败";
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error}
        </h1>
        <a
          href="/"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          返回首页
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm space-x-4">
          <span>
            {new Date(post.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span>·</span>
          <span>{post.published ? "已发布" : "草稿"}</span>
        </div>
      </header>

      {/* 封面图 */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 文章内容 */}
      <article className="prose dark:prose-invert max-w-none mb-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      {/* 评论区 */}
      <CommentSection postId={post.id} />
    </div>
  );
}
