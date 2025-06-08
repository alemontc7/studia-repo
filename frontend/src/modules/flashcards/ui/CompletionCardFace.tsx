import React from 'react';
import { Check } from 'lucide-react';
import { Flashcard } from '../domain/flashcard';
import { FlashcardAnswerService } from '../application/flashcardAnswerService';

interface CompletionCardFaceProps {
  card: Flashcard;
  selectedWords: string[];
  onToggleWord: (word: string) => void;
  onCheckAnswer: () => void;
  showResult: boolean;
  isAnswerCorrect: boolean | null;
}

export const CompletionCardFace: React.FC<CompletionCardFaceProps> = ({
  card,
  selectedWords,
  onToggleWord,
  onCheckAnswer,
  showResult,
  isAnswerCorrect
}) => {
  const displayChallenge = FlashcardAnswerService.getDisplayChallenge(card, selectedWords);
  const hasSelectedWords = selectedWords.length > 0;

  return (
    <div className="relative w-full">
      <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl border border-purple-200/50 overflow-hidden">
        <div className="p-8 h-full flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Completar</h3>
              {showResult && (
                <div className="text-2xl">
                  {isAnswerCorrect ? '😊' : '😢'}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/70 p-4 rounded-lg">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {displayChallenge}
                </p>
              </div>

              {/* Solution Words */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Selecciona las palabras:</p>
                <div className="flex flex-wrap gap-2">
                  {card.solutionWords.map((word, index) => (
                    <button
                      key={`${word}-${index}`}
                      onClick={() => onToggleWord(word)}
                      disabled={showResult}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        selectedWords.includes(word)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      } ${showResult ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check Button */}
              {hasSelectedWords && !showResult && (
                <button
                  onClick={onCheckAnswer}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Verificar Respuesta</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};