import { get } from "lodash";
import { Flashcard } from "../domain/flashcard";
import { createFlashcardApi,getFlashcardsApi } from "../infrastructure/flashcardsApi";

export class FlashcardService {
    async createFlashcard(model: string, noteId: string): Promise<Flashcard[]> {
        const response = await createFlashcardApi(model, noteId);
        return response;
    }

    async getFlashcards(noteId: string): Promise<Flashcard[]> {
        console.log("Fetching flashcards for noteId:", noteId);
        const response = await getFlashcardsApi(noteId);
        console.log("Fetched flashcards:", response);
        return response;
    }
}