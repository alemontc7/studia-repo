// view/hooks/useFlashcardState.ts (CORREGIDO)

// 1. Importa useCallback
import { useState, useEffect, useCallback } from 'react'; 
import { FlashcardStateService, FlashcardViewState } from '../application/flashcardStateService';
import { Flashcard, FlashcardType } from '../domain/flashcard';
import { FlashcardAnswerService } from '../application/flashcardAnswerService';

export const useFlashcardState = () => {
    const [stateService] = useState(() => new FlashcardStateService());
    const [viewState, setViewState] = useState<FlashcardViewState>(stateService.getState());

    useEffect(() => {
        const unsubscribe = stateService.subscribe(setViewState);
        return unsubscribe;
    }, [stateService]);

  // 2. Envuelve todas las funciones devueltas en useCallback
  //    La dependencia [stateService] es estable, por lo que estas funciones
  //    se crearán solo una vez.

  const flipCard = useCallback(() => stateService.flipCard(), [stateService]);
  const selectAnswer = useCallback((answer: string) => stateService.selectAnswer(answer), [stateService]);
  const toggleWordSelection = useCallback((word: string) => stateService.toggleWordSelection(word), [stateService]);
  const showHint = useCallback(() => stateService.showHint(), [stateService]);
  const resetState = useCallback(() => stateService.resetCardState(), [stateService]);
  const setCardType = useCallback((type: FlashcardType) => stateService.setCardType(type), [stateService]);

  const checkAnswer = useCallback((card: Flashcard) => {
    if (card.type === 'completion' || card.type === 'code_fill') {
      // viewState debe ser una dependencia si se usa dentro del callback
      const result = FlashcardAnswerService.validateCompletionAnswer(card, viewState.selectedWords);
      stateService.checkAnswer(card.solutionWords, card.challenge);
    }
}, [stateService, viewState.selectedWords]); // Añade las dependencias necesarias

return {
    viewState,
    flipCard,
    selectAnswer,
    toggleWordSelection,
    checkAnswer,
    showHint,
    resetState,
    setCardType
};
};