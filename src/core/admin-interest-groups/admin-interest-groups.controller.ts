import type { Request, Response } from 'express';

import { groupUsersByInterest } from './admin-interest-groups.service';

export async function listUserInterestGroups(_req: Request, res: Response): Promise<void> {
  const groups = await groupUsersByInterest();

  res.status(200).json(groups);
}
