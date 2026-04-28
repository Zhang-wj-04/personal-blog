import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fileDb } from "@/lib/file-db";

// 获取所有标签（公开）
export async function GET() {
  try {
    const tags = await fileDb.getTags();
    tags.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

// 创建标签（仅管理员）
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug } = body;

    const tag = await fileDb.createTag({
      name,
      slug,
    });

    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
