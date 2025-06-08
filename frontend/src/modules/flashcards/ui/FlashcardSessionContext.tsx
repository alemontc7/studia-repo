import React, { createContext, useContext, ReactNode } from 'react';
import { Flashcard } from '../domain/flashcard';
import { useFlashcardSession } from './useFlashcardSession';

type FlashcardSessionContextType = ReturnType<typeof useFlashcardSession>;

const FlashcardSessionContext = createContext<FlashcardSessionContextType | null>(null);

export const FlashcardSessionProvider = ({ children, cards }: { children: ReactNode; cards: Flashcard[] }) => {
  const session = useFlashcardSession(cards);
  return (
    <FlashcardSessionContext.Provider value={session}>
      {children}
    </FlashcardSessionContext.Provider>
  );
};

export const useSharedFlashcardSession = () => {
  const context = useContext(FlashcardSessionContext);
  if (!context) {
    throw new Error('useSharedFlashcardSession debe ser usado dentro de un FlashcardSessionProvider');
  }
  return context;
};