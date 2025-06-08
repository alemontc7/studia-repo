import { Flashcard, FlashcardProgress } from "./flashcard";

export interface FlashcardRepositoryPort {
  getFlashcards(): Promise<Flashcard[]>;
  saveProgress(progress: FlashcardProgress[]): Promise<void>;
  getProgress(): Promise<FlashcardProgress[]>;
}