import { getPostBySlug, getAllPosts } from '@/lib/posts';
import PostDetailClient from './PostDetailClient';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">文章未找到</h1>
      </div>
    );
  }

  return <PostDetailClient post={post} initialComments={[]} />;
}
