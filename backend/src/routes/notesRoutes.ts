import express from 'express';
import NotesController from '../modules/Notes/Infrastructure/note.controller';
import { requireAuth } from '../middleware/requireAuth';

const notesControllerInstance = new NotesController();

const router = express.Router();

router.use(requireAuth);
router.post('/', (req, res) => notesControllerInstance.saveNote(req,res));
router.delete('/', (req, res) => notesControllerInstance.deleteNote(req,res));
router.get('/', (req, res) => notesControllerInstance.getNotes(req,res));
export default router;