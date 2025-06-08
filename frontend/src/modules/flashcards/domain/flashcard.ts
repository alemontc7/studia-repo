export type FlashcardType =
  | 'conceptual'
  | 'completion'
  | 'code_fill'

export interface Flashcard {
  id: string;
  noteId: string;
  type: FlashcardType;
  challenge: string;
  solution: string;
  tags: string[];
  solutionWords: string[];
  createdAt: string;
  updatedAt: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  contextSnippet?: string;
  hint?: string;
  explanation?: string;
}

export interface FlashcardSession {
  id: string;
  cards: SessionCard[];
  currentCardIndex: number;
  stats: SessionStats;
  isCompleted: boolean;
}

export interface SessionStats {
    startTime: number;
    endTime: number | null;
    questionsAttempted: number;
    questionsCorrect: number;
    conceptualCardsReviewed: number;
}

export interface FlashcardProgress {
  cardId: string;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  attempts: number;
}

export interface FlashcardSessionPort {
  getCurrentCard(): Flashcard | null;
  goToNextCard(): boolean;
  goToPreviousCard(): boolean;
  markCardAsCompleted(cardId: string, difficulty: 'easy' | 'medium' | 'hard'): void;
  getProgress(): { current: number; total: number };
  isSessionCompleted(): boolean;
  direction: 'next' | 'previous' | 'initial';
}

export interface FlashcardRepositoryPort {
  getFlashcards(): Promise<Flashcard[]>;
  saveProgress(progress: FlashcardProgress[]): Promise<void>;
  getProgress(): Promise<FlashcardProgress[]>;
}

export interface SessionCard extends Flashcard {
    isAttempted: boolean;
    isCorrect: boolean | null;
}