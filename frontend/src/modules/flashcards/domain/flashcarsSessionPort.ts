import { Flashcard } from "./flashcard";

export interface FlashcardSessionPort {
  getCurrentCard(): Flashcard | null;
  goToNextCard(): boolean;
  goToPreviousCard(): boolean;
  markCardAsCompleted(cardId: string, difficulty: 'easy' | 'medium' | 'hard'): void;
  getProgress(): { current: number; total: number };
  isSessionCompleted(): boolean;
}