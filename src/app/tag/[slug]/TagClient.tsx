'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from './types';

interface TagClientProps {
  tag: { _id: string; name: string; slug: string };
  posts: Post[];
}

export default function TagClient({ tag, posts }: TagClientProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">标签：#{tag.name}</h1>
        <p className="text-sm text-gray-500">
          共 {posts.length} 篇文章
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg">
              {post.coverImage && (
                <div className="relative h-40 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="mb-2 text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          该标签下暂无文章
        </div>
      )}
    </div>
  );
}
