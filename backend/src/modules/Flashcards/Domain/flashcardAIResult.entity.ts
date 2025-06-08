import { FlashcardType } from "../Domain/flashcard.entity";

export interface FlashcardAIResult{
    type: FlashcardType;
    challenge: string;
    solution: string;
    tags: string[];
    difficulty?: string;
    solutionWords: string[];
    contextSnippet?: string;
    hint?: string;
    explanation?: string;
} 