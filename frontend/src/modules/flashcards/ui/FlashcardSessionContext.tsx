import React, { createContext, useContext, ReactNode } from 'react';
import { Flashcard } from '../domain/flashcard';
import { useFlashcardSession } from './useFlashcardSession';

// 1. Definimos la "forma" de los datos que nuestro contexto compartirá.
// Es simplemente el tipo de lo que devuelve nuestro hook useFlashcardSession.
type FlashcardSessionContextType = ReturnType<typeof useFlashcardSession>;

// 2. Creamos el Contexto. El valor inicial es null.
const FlashcardSessionContext = createContext<FlashcardSessionContextType | null>(null);

// 3. Creamos un componente "Proveedor".
//    Este componente llamará al hook y proveerá el valor a sus hijos.
export const FlashcardSessionProvider = ({ children, cards }: { children: ReactNode; cards: Flashcard[] }) => {
  const session = useFlashcardSession(cards);
  
  return (
    <FlashcardSessionContext.Provider value={session}>
      {children}
    </FlashcardSessionContext.Provider>
  );
};

// 4. Creamos un hook personalizado para consumir el contexto fácilmente.
//    Esto evita tener que importar `useContext` y `FlashcardSessionContext` en todos lados.
export const useSharedFlashcardSession = () => {
  const context = useContext(FlashcardSessionContext);
  if (!context) {
    throw new Error('useSharedFlashcardSession debe ser usado dentro de un FlashcardSessionProvider');
  }
  return context;
};