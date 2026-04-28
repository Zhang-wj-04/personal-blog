"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Comment {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError("获取评论失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("请先登录");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      setContent("");
      fetchComments(); // 重新加载评论
    } catch (err) {
      setError("提交评论失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        评论 ({comments.length})
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* 评论表单 */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="写下你的评论..."
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "提交中..." : "提交评论"}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-300">
            请<button onClick={() => (window.location.href = "/login")} className="text-blue-600 hover:text-blue-700">登录</button>后发表评论
          </p>
        </div>
      )}

      {/* 评论列表 */}
      {loading ? (
        <div className="text-center py-4">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无评论，快来发表第一条评论吧！
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div
              key={comment._id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {comment.authorName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}