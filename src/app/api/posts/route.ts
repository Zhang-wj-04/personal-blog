import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fileDb } from "@/lib/file-db";

// 获取所有文章（管理员）
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await fileDb.getPosts();
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, categoryIds, tagIds, published } = body;

    const post = await fileDb.createPost({
      title,
      slug,
      content,
      excerpt: excerpt || content?.substring(0, 200) || "",
      coverImage,
      categoryIds: categoryIds || [],
      tagIds: tagIds || [],
      published: published || false,
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
