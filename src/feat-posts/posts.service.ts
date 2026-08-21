import { Post } from './post.model';
import type { CreatePostInput, PostsPagination } from './posts.validation';

export async function savePost(userId: string, input: CreatePostInput) {
  return Post.create({
    userId,
    title: input.title,
    content: input.content,
  });
}

export async function findPosts(pagination: PostsPagination) {
  const skip = (pagination.page - 1) * pagination.limit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip(skip).limit(pagination.limit),
    Post.countDocuments(),
  ]);

  return { posts, total };
}
