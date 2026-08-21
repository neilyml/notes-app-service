import { User } from '../users/user.model';

export async function groupUsersByInterest() {
  return User.aggregate([
    {
      $sort: { email: 1 },
    },
    {
      $unwind: '$interests',
    },
    {
      $group: {
        _id: '$interests',
        users: {
          $push: {
            id: { $toString: '$_id' },
            email: '$email',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        interest: '$_id',
        users: 1,
      },
    },
    {
      $sort: { interest: 1 },
    },
  ]);
}
