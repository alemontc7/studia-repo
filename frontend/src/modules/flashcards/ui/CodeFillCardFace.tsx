import React from 'react';
import { Check } from 'lucide-react';
import { Flashcard } from '../domain/flashcard';
import { FlashcardAnswerService } from '../application/flashcardAnswerService';
import 'highlight.js/styles/github-dark.css'; // O prueba 'atom-one-dark.css' para otro estilo
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Asegúrate de que este import esté


interface CodeFillCardFaceProps {
  card: Flashcard;
  selectedWords: string[];
  onToggleWord: (word: string) => void;
  onCheckAnswer: () => void;
  showResult: boolean;
  isAnswerCorrect: boolean | null;
}

export const CodeFillCardFace: React.FC<CodeFillCardFaceProps> = ({
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
      <div className="w-full h-full bg-gradient-to-br from-[#0B87DC]/5 to-[#0B87DC]/10 rounded-2xl shadow-xl border border-[#0B87DC]/5 overflow-hidden">
        <div className="p-8 h-full flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0B87DC]/10 to-transparent rounded-bl-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Código</h3>
              {showResult && (
                <div className="text-2xl">
                  {isAnswerCorrect ? '😊' : '😢'}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-white text-sm leading-relaxed whitespace-pre-wrap font-mono prose prose-invert">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {displayChallenge}
                  </ReactMarkdown>
                </div>
            </div>

              {/* Solution Words */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Selecciona el código:</p>
                <div className="flex flex-wrap gap-2">
                  {card.solutionWords.map((word, index) => (
                    <button
                      key={`${word}-${index}`}
                      onClick={() => onToggleWord(word)}
                      disabled={showResult}
                      className={`px-3 py-2 rounded-lg border font-mono text-sm transition-colors ${
                        selectedWords.includes(word)
                          ? 'bg-[#0B87DC] text-white border-[#0B87DC]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#0B87DC]'
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
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#0B87DC] text-white rounded-lg hover:bg-[#0B87DC] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Verificar Código</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};