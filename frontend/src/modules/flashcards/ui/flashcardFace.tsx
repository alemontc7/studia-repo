import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Check } from 'lucide-react';
import { Flashcard, SessionCard } from '../domain/flashcard';
import { ConceptualCardFace } from './ConceptualCardFace';
import { CompletionCardFace } from './CompletionCardFace';
import { CodeFillCardFace } from './CodeFillCardFace';

interface FlashcardFaceProps {
  card: SessionCard;
  isFlipped: boolean;
  onFlip: () => void;
  selectedWords: string[];
  onToggleWord: (word: string) => void;
  onCheckAnswer: () => void;
  showResult: boolean;
  isAnswerCorrect: boolean | null;
  isAttempted: boolean;
  onCardTypeChange: (type: Flashcard['type']) => void;
}

export const FlashcardFace: React.FC<FlashcardFaceProps> = ({
  card,
  isFlipped,
  onFlip,
  selectedWords,
  onToggleWord,
  onCheckAnswer,
  showResult,
  isAnswerCorrect,
  isAttempted,
  onCardTypeChange,
}) => {
  useEffect(() => {
    onCardTypeChange(card.type);
  }, [card.type, onCardTypeChange]);

  const renderCardContent = () => {
    switch (card.type) {
      case 'conceptual':
        return (
          <ConceptualCardFace
            card={card}
            isFlipped={isFlipped}
            onFlip={onFlip}
          />
        );
      case 'completion':
        return (
          <CompletionCardFace
            card={card}
            selectedWords={selectedWords}
            onToggleWord={onToggleWord}
            onCheckAnswer={onCheckAnswer}
            showResult={showResult}
            isAnswerCorrect={isAnswerCorrect}
          />
        );
      case 'code_fill':
        return (
          <CodeFillCardFace
            card={card}
            selectedWords={selectedWords}
            onToggleWord={onToggleWord}
            onCheckAnswer={onCheckAnswer}
            showResult={showResult}
            isAnswerCorrect={isAnswerCorrect}
          />
        );
      default:
        return null;
    }
  };

  return renderCardContent();
};