import { Flashcard } from "../Domain/flashcard.entity";
import { generateFlashCards, fetchFlashcardsByNoteId } from "../Infrastructure/flashcard.repository";

export class FlashcardsService {
  async generateFlashcards(noteId: string, model: string): Promise<Flashcard[]> {
    console.log("I am inside the service call");
    return generateFlashCards(noteId, model);
  }

  async fetchFlashcardsByNoteId(noteId: string): Promise<Flashcard[]> {
    console.log("Fetching flashcards for note ID:", noteId);
    return fetchFlashcardsByNoteId(noteId);
  }
}