import express from 'express';

import { requireAuth } from '../middleware/requireAuth';
import GraphicOrganizerController from '../modules/GraphicOrganizers/Infrastructure/organizer.controller';

const organizerController = new GraphicOrganizerController();

const router = express.Router();

router.use(requireAuth);
router.post('/generate', (req, res) => organizerController.generate(req, res));
router.get('/:noteId', (req, res) => organizerController.getByNoteId(req, res));
export default router;