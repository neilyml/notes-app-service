import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { createNote, listNotes } from './notes.controller';

const router = Router();

router.use(authenticate);
router.post('/', createNote);
router.get('/', listNotes);

export default router;
