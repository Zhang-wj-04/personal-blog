import PostCard from "@/components/blog/PostCard";
import { fileDb } from "@/lib/file-db";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  let posts: any[] = [];
  let tagName = slug;

  try {
    const [tags, allPosts] = await Promise.all([
      fileDb.getTags(),
      fileDb.getPosts(),
    ]);

    const tag = tags.find((t) => t.slug === slug);
    if (tag) {
      tagName = tag.name;
      posts = allPosts.filter(
        (p) => p.published && p.tagIds?.includes(tag.id)
      );
    }
  } catch (error) {
    console.error("Failed to fetch tag posts:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        标签: {tagName}
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            该标签下暂无文章
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
