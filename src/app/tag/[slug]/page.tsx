import { getAllTags, getPostsByTag } from '@/lib/posts';
import TagClient from './TagClient';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tags = getAllTags();
  const tag = tags.find((t) => t.slug === slug);
  const posts = getPostsByTag(slug);

  if (!tag) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">标签未找到</h1>
      </div>
    );
  }

  return <TagClient tag={tag} posts={posts} />;
}
