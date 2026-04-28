import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fileDb } from "@/lib/file-db";

// 获取所有分类（公开）
export async function GET() {
  try {
    const categories = await fileDb.getCategories();
    categories.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// 创建分类（仅管理员）
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const category = await fileDb.createCategory({
      name,
      slug,
      description: description || "",
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
