import { useState, useEffect, useCallback } from 'react';
// 1. Importamos los nuevos tipos que creamos para el estado de la sesión
import { Flashcard, SessionCard, SessionStats } from '../domain/flashcard';
import { FlashcardSessionUseCase } from '../application/flashcardSessionUseCase';

interface SessionHookState {
  card: SessionCard | null;
  progress: { current: number; total: number };
  isCompleted: boolean;
  stats: SessionStats | null;
  direction: 'next' | 'previous' | 'initial';
}

export const useFlashcardSession = (cards: Flashcard[]) => {
  const [sessionUseCase] = useState(() => new FlashcardSessionUseCase());

  const [sessionState, setSessionState] = useState<SessionHookState>({
    ...sessionUseCase.getSessionState(),
    direction: 'initial',
  });

  useEffect(() => {
    if (cards.length > 0) {
      sessionUseCase.initializeSession(cards);
      setSessionState(prevState => ({
        ...prevState,
        ...sessionUseCase.getSessionState(),
      }));
    }
  }, [cards, sessionUseCase]);

  const updateStateAfterAction = (newDirection: 'next' | 'previous' | 'initial') => {
    setSessionState({
      ...sessionUseCase.getSessionState(),
      direction: newDirection,
    });
  };

  const goToNext = useCallback(() => {
    sessionUseCase.goToNextCard();
    updateStateAfterAction('next');
  }, [sessionUseCase]);

  const goToPrevious = useCallback(() => {
    sessionUseCase.goToPreviousCard();
    updateStateAfterAction('previous');
  }, [sessionUseCase]);

  const submitAnswer = useCallback((cardId: string, isCorrect: boolean) => {
    sessionUseCase.submitAnswer(cardId, isCorrect);
    setSessionState(prevState => ({ ...prevState, ...sessionUseCase.getSessionState() }));
  }, [sessionUseCase]);

  return {
    currentCard: sessionState.card,
    progress: sessionState.progress,
    isSessionCompleted: sessionState.isCompleted,
    stats: sessionState.stats,
    direction: sessionState.direction,
    goToNext,
    goToPrevious,
    submitAnswer,
    canGoToNext: sessionState.card ? sessionState.progress.current <= sessionState.progress.total : false,
    canGoToPrevious: sessionState.card && sessionState.progress.current > 1,
  };
};