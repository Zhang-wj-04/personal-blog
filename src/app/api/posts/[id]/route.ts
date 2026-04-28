import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fileDb } from "@/lib/file-db";

// 获取单篇文章
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await fileDb.getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, categoryIds, tagIds, published } = body;

    const updated = await fileDb.updatePost(id, {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImage !== undefined && { coverImage }),
      ...(categoryIds !== undefined && { categoryIds }),
      ...(tagIds !== undefined && { tagIds }),
      ...(published !== undefined && { published }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post updated successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fileDb.deletePost(id);

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
