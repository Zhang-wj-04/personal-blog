import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import PostsClient from './PostsClient';

export default async function HomePage() {
  const [posts, categories, tags] = await Promise.all([
    Promise.resolve(getAllPosts()),
    Promise.resolve(getAllCategories()),
    Promise.resolve(getAllTags()),
  ]);

  return (
    <PostsClient
      initialPosts={posts}
      categories={categories}
      tags={tags}
    />
  );
}
