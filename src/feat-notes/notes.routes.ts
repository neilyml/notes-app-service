import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { createNote, deleteNote, getNote, listNotes, updateNote } from './notes.controller';

const router = Router();

router.use(authenticate);
router.post('/', createNote);
router.get('/', listNotes);
router.get('/:noteId', getNote);
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;
