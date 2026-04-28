import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// User Schema
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Post Schema
interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author: mongoose.Types.ObjectId;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

// Category Schema
interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

// Tag Schema
interface ITag extends Document {
  name: string;
  slug: string;
}

const TagSchema = new mongoose.Schema<ITag>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

export const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);

// Comment Schema
interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
