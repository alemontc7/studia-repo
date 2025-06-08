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
  difficulty?: string;
  contextSnippet?: string;
  hint?: string;
  explanation?: string;
}
