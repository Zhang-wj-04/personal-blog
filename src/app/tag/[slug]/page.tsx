import { connectToDatabase } from "@/lib/db";
import PostCard from "@/components/blog/PostCard";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  let posts: any[] = [];
  let tagName = params.slug;

  try {
    const { db } = await connectToDatabase();
    
    // 查找标签
    const tag = await db.collection("tags").findOne({ slug: params.slug });
    if (tag) {
      tagName = tag.name;
      
      // 查找该标签下的文章
      posts = await db
        .collection("posts")
        .find({ 
          tagIds: tag._id.toString(),
          published: true 
        })
        .sort({ createdAt: -1 })
        .toArray();
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
          {posts.map(post => (
            <PostCard key={post._id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}