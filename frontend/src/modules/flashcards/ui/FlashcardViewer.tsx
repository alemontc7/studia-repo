import React from 'react';
import { useSharedFlashcardSession } from './FlashcardSessionContext';
import { useFlashcardState } from './useFlashcardState';
import { FlashcardFace } from './flashcardFace';
import { FlashcardAnswerService } from '../application/flashcardAnswerService';
import { SessionSummary } from './SessionSummary';
import { FlashcardDifficultySelector } from './FlashcardDifficultySelector';

interface FlashcardViewerProps {
  onClose?: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ onClose }) => {
  const { 
    currentCard, 
    submitAnswer: submitAnswerToSession,
    isSessionCompleted,
    stats
  } = useSharedFlashcardSession();
  
  const { 
    viewState, 
    flipCard, 
    toggleWordSelection, 
    checkAnswer: checkAnswerInView,
    resetState,
    setCardType
  } = useFlashcardState();

  React.useEffect(() => {
    if (currentCard) {
      resetState();
    }
  }, [currentCard?.id, resetState]);

  const handleCheckAnswer = () => {
    if (!currentCard) return;
    const { isCorrect } = FlashcardAnswerService.validateCompletionAnswer(
      currentCard, 
      viewState.selectedWords
    );
    checkAnswerInView(currentCard);
    submitAnswerToSession(currentCard.id, isCorrect);
  };

  if (isSessionCompleted && stats) {
    return <SessionSummary stats={stats} onClose={onClose} />;
  }

  if (!currentCard) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <FlashcardFace
          card={currentCard}
          isFlipped={viewState.isFlipped}
          onFlip={flipCard}
          selectedWords={viewState.selectedWords}
          onToggleWord={toggleWordSelection}
          onCheckAnswer={handleCheckAnswer}
          showResult={viewState.showResult}
          isAnswerCorrect={viewState.isAnswerCorrect}
          isAttempted={currentCard.isAttempted} 
          onCardTypeChange={setCardType}
        />
        {/* <FlashcardDifficultySelector />*/}
      </div>
    </div>
  );
};