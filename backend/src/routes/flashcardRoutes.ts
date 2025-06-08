import express from 'express';
import FlashcardsController from '../modules/Flashcards/Infrastructure/flashcard.controller';
import { requireAuth } from '../middleware/requireAuth';

const flashcardControllerInstance = new FlashcardsController();

const router = express.Router();

router.use(requireAuth);
router.get('/', (req, res) => flashcardControllerInstance.generate(req,res));
router.get('/:noteId', (req, res) => flashcardControllerInstance.fetchFlashcardsByNoteId(req,res));
export default router;
