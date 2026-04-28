import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

// 获取所有标签（公开）
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const tags = await db
      .collection("tags")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(tags);
  } catch (error) {
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

    const { db } = await connectToDatabase();
    
    const tag = {
      name,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tags").insertOne(tag);
    
    return NextResponse.json({ ...tag, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}