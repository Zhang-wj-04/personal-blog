import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB, Post, Category, Tag, Comment } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FileText, FolderOpen, TagIcon, MessageSquare, TrendingUp } from 'lucide-react';

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const [postsCount, categoriesCount, tagsCount, commentsCount] =
    await Promise.all([
      Post.countDocuments({}),
      Category.countDocuments({}),
      Tag.countDocuments({}),
      Comment.countDocuments({}),
    ]);

  const publishedPostsCount = await Post.countDocuments({ published: true });
  const draftPostsCount = await Post.countDocuments({ published: false });
  const pendingCommentsCount = await Comment.countDocuments({ approved: false });

  const stats = [
    {
      title: '文章总数',
      value: postsCount,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '已发布',
      value: publishedPostsCount,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '草稿',
      value: draftPostsCount,
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: '分类',
      value: categoriesCount,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: '标签',
      value: tagsCount,
      icon: TagIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: '评论',
      value: commentsCount,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-600">
          欢迎回来，{session.user?.name || session.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-5">
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {pendingCommentsCount > 0 && (
        <div className="mt-6 rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                待审核评论
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  有 {pendingCommentsCount} 条评论等待审核。
                </p>
              </div>
              <div className="mt-4">
                <Link href="/admin/comments">
                  <Button variant="outline" size="sm">
                    查看评论
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/posts/new">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">写新文章</h3>
            <p className="mt-1 text-sm text-gray-600">
              创建一篇新的博客文章
            </p>
          </Card>
        </Link>

        <Link href="/admin/posts">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">管理文章</h3>
            <p className="mt-1 text-sm text-gray-600">
              编辑或删除已有文章
            </p>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">管理分类</h3>
            <p className="mt-1 text-sm text-gray-600">
              创建和管理文章分类
            </p>
          </Card>
        </Link>

        <Link href="/admin/comments">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900">管理评论</h3>
            <p className="mt-1 text-sm text-gray-600">
              审核和管理用户评论
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
