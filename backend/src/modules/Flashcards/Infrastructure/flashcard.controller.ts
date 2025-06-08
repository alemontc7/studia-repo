import { Request } from "express";
import { Response } from "express";
import { FlashcardsService } from "../Application/flashcards.service";
import { Flashcard } from "../Domain/flashcard.entity";

export default class FlashcardsController {

    private flashcardsService = new FlashcardsService();

    async generate(req: Request, res: Response): Promise<void>{
        console.log("I AM INSIDE THE CONTROLLER CALL");
        try {
            const noteId = req.body.noteId as string;
            const model = req.body.model as string;
            const flashcards: Flashcard[] = await this.flashcardsService.generateFlashcards(noteId, model);
            res.status(200).json(flashcards);
        } catch (error: any) {
            res.status(400).json({
                message: error.message || 'Error generating flashcards'
            });
        }
    }

    async fetchFlashcardsByNoteId(req: Request, res: Response): Promise<void> {
        try {
            const noteId = req.params.noteId;
            console.log("Fetching flashcards for note ID:", noteId);
            const flashcards = await this.flashcardsService.fetchFlashcardsByNoteId(noteId);
            res.status(200).json(flashcards);
        } catch (error: any) {
            res.status(400).json({
                message: error.message || 'Error fetching flashcards'
            });
        }
    }
}