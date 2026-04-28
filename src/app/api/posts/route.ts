import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB, Post, Category, Tag } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

// 获取所有文章
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const published = searchParams.get('published');

    const query: any = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (published !== null) query.published = published === 'true';

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { title, content, excerpt, coverImage, category, tags, published } = body;

    // 生成 slug
    let slug = body.slug || generateSlug(title);

    // 检查 slug 是否重复
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // 处理分类
    let categoryId;
    if (category) {
      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: category,
          slug: generateSlug(category),
        });
      }
      categoryId = categoryDoc._id;
    }

    // 处理标签
    let tagIds: any = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tagDoc = await Tag.findOne({ name: tagName });
        if (!tagDoc) {
          tagDoc = await Tag.create({
            name: tagName,
            slug: generateSlug(tagName),
          });
        }
        tagIds.push(tagDoc._id);
      }
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category: categoryId,
      tags: tagIds,
      author: session.user?.id,
      published: published || false,
    });

    await post.populate('author', 'name email');
    if (categoryId) await post.populate('category');
    if (tagIds.length > 0) await post.populate('tags');

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
