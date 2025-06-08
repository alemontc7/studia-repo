// view/hooks/useFlashcardSession.ts
import { useState, useEffect, useCallback } from 'react';
import { Flashcard, FlashcardRepositoryPort } from '../domain/flashcard';
import { FlashcardSessionUseCase } from '../application/flashcardSessionUseCase';
import { set } from 'lodash';

// You'd inject this dependency in a real app
const mockRepository: FlashcardRepositoryPort = {
  getFlashcards: async () => [],
  saveProgress: async () => {},
  getProgress: async () => []
};

export const useFlashcardSession = (cards: Flashcard[]) => {
  const [sessionUseCase] = useState(() => new FlashcardSessionUseCase(mockRepository));
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [direction, setDirection] = useState<'next' | 'previous' |'initial'>('initial');

  useEffect(() => {
    if (cards.length > 0) {
      sessionUseCase.initializeSession(cards).then(() => {
        setCurrentCard(sessionUseCase.getCurrentCard());
        setProgress(sessionUseCase.getProgress());
      });
    }
  }, [cards, sessionUseCase]);

  const goToNext = useCallback(() => {
    setDirection('next');
    if (sessionUseCase.goToNextCard()) {
      setCurrentCard(sessionUseCase.getCurrentCard());
      setProgress(sessionUseCase.getProgress());
    }
  }, [sessionUseCase]);

  const goToPrevious = useCallback(() => {
    setDirection('previous');
    if (sessionUseCase.goToPreviousCard()) {
      setCurrentCard(sessionUseCase.getCurrentCard());
      setProgress(sessionUseCase.getProgress());
    }
  }, [sessionUseCase]);

  const markAsCompleted = useCallback((cardId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    sessionUseCase.markCardAsCompleted(cardId, difficulty);
  }, [sessionUseCase]);

  return {
    currentCard,
    progress,
    goToNext,
    goToPrevious,
    markAsCompleted,
    canGoToNext: progress.current < progress.total,
    canGoToPrevious: progress.current > 1,
    isCompleted: sessionUseCase.isSessionCompleted(),
    direction,
  };
};