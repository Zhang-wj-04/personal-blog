'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Comment } from './types';

interface PostDetailClientProps {
  post: Post;
  initialComments: Comment[];
}

export default function PostDetailClient({
  post,
  initialComments,
}: PostDetailClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !email || !content) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post._id,
          author,
          email,
          content,
        }),
      });

      if (res.ok) {
        setAuthor('');
        setEmail('');
        setContent('');
        alert('评论已提交，等待审核');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* 文章头部 */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
          <span>·</span>
          <span>{post.views} 次阅读</span>
        </div>
        {post.category && (
          <div className="mt-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* 封面图 */}
      {post.coverImage && (
        <div className="relative mb-8 h-96 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* 评论区 */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">
          评论 ({comments.length})
        </h2>

        {/* 评论表单 */}
        <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="姓名"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2"
              required
            />
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2"
              required
            />
          </div>
          <textarea
            placeholder="写下你的评论..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交评论'}
          </button>
        </form>

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            暂无评论，来留下第一条评论吧！
          </div>
        )}
      </div>
    </div>
  );
}
