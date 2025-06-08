import React from 'react';
import { useFlashcardSession } from './useFlashcardSession';

export const FlashcardDifficultySelector: React.FC = () => {
  const { currentCard, markAsCompleted } = useFlashcardSession([]);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (currentCard) {
      markAsCompleted(currentCard.id, difficulty);
    }
  };

  const difficulties = [
    { label: 'Difícil', value: 'hard' as const },
    { label: 'Medio', value: 'medium' as const },
    { label: 'Fácil', value: 'easy' as const }
  ];

  return (
    <div className="mt-6 flex justify-center space-x-3">
      {difficulties.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleDifficultySelect(value)}
          className="px-4 py-2 rounded-lg hover:border-neutral-400 transition-colors border hover:bg-neutral-50"
        >
          {label}
        </button>
      ))}
    </div>
  );
};