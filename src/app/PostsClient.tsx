'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Category, Tag } from './types';

interface PostsClientProps {
  initialPosts: Post[];
  categories: Category[];
  tags: Tag[];
}

export default function PostsClient({
  initialPosts,
  categories,
  tags,
}: PostsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const filteredPosts = initialPosts.filter((post) => {
    if (selectedCategory && post.category?.slug !== selectedCategory) return false;
    if (selectedTag && !post.tags?.some((t) => t.slug === selectedTag)) return false;
    return true;
  });

  return (
    <div>
      {/* 筛选器 */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="">所有分类</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="">所有标签</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* 文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug}`}>
            <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg">
              {post.coverImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-4 text-sm text-gray-600">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.author.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          暂无文章
        </div>
      )}
    </div>
  );
}
