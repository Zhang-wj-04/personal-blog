import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// 获取所有分类（公开）
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(categories);
  } catch (error) {
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

    const { db } = await connectToDatabase();
    
    const category = {
      name,
      slug,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(category);
    
    return NextResponse.json({ ...category, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}