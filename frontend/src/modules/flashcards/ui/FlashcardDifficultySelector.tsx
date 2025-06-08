import React from 'react';
import { useSharedFlashcardSession } from './FlashcardSessionContext';

export const FlashcardDifficultySelector: React.FC = () => {
    const { currentCard, submitAnswer, goToNext } = useSharedFlashcardSession();
    const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
        
        if (currentCard) {
            submitAnswer(currentCard.id, true);
            goToNext();
        }
    };
    
    if (!currentCard || currentCard.type !== 'conceptual' || currentCard.isAttempted) {
        return null;
    }
    
    const difficulties = [
        { label: 'Difícil', value: 'hard' as const, color: 'border-red-400 hover:bg-red-50' },
        { label: 'Medio', value: 'medium' as const, color: 'border-yellow-400 hover:bg-yellow-50' },
        { label: 'Fácil', value: 'easy' as const, color: 'border-green-400 hover:bg-green-50' }
    ];
    
    return (
    <div className="mt-10">
        <p className="text-sm text-gray-600 mb-3 text-center">¿Qué tan bien entiendes este concepto?</p>
        <div className="flex justify-center space-x-3">
            {difficulties.map(({ label, value, color }) => (
                <button
                key={value}
                onClick={() => handleDifficultySelect(value)}
                className={`px-4 py-2 rounded-lg transition-colors border-2 ${color}`}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
    );
};