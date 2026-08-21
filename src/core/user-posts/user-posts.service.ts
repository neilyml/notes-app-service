import { Types } from 'mongoose';

import { Post } from '../posts/post.model';
import { User } from '../users/user.model';

export async function findUserWithPosts(userId: string) {
  const users = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: Post.collection.name,
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$userId', '$$userId'],
              },
            },
          },
          {
            $sort: { createdAt: -1, _id: -1 },
          },
          {
            $project: {
              _id: 0,
              id: { $toString: '$_id' },
              title: 1,
              content: 1,
              createdAt: 1,
            },
          },
        ],
        as: 'posts',
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        email: 1,
        posts: 1,
      },
    },
  ]);

  return users[0] ?? null;
}
