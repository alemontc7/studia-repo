import React from 'react';
import { Flashcard } from '../domain/flashcard';
import { useFlashcardSession } from './useFlashcardSession';
import { useFlashcardState } from './useFlashcardState';
import { FlashcardFace } from './flashcardFace';
import { FlashcardDifficultySelector } from './FlashcardDifficultySelector';
import { useSharedFlashcardSession } from './FlashcardSessionContext';

interface FlashcardViewerProps {
  //cards: Flashcard[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = () => {
  const { currentCard } = useSharedFlashcardSession();
  const { 
    viewState, 
    flipCard, 
    selectAnswer, 
    toggleWordSelection, 
    checkAnswer, 
    setCardType,
    resetState 
  } = useFlashcardState();

  // Reset state when card changes
  React.useEffect(() => {
    if (currentCard) {
      resetState();
    }
  }, [currentCard?.id, resetState]);

  if (!currentCard) return null;

  const handleCheckAnswer = () => {
    checkAnswer(currentCard);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <FlashcardFace
          card={currentCard}
          isFlipped={viewState.isFlipped}
          onFlip={flipCard}
          selectedAnswer={viewState.selectedAnswer}
          onSelectAnswer={selectAnswer}
          selectedWords={viewState.selectedWords}
          onToggleWord={toggleWordSelection}
          onCheckAnswer={handleCheckAnswer}
          showResult={viewState.showResult}
          isAnswerCorrect={viewState.isAnswerCorrect}
          onCardTypeChange={setCardType}
        />
        
        {/* Only show difficulty selector for conceptual cards or after showing result 
        {(currentCard.type === 'conceptual' || viewState.showResult) && (
          <FlashcardDifficultySelector />
        )}*/}
      </div>
    </div>
  );
};