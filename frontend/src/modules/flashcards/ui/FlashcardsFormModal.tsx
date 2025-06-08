import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { FlashcardService } from '../application/flashcardService';
import { FlashcardModal } from './FlashcardsResultModal';
import { set } from 'lodash';
import { WaitGeneration } from './waitGeneration';

interface FlashcardsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardsFormModal: React.FC<FlashcardsFormModalProps> = (
  { 
    isOpen, 
    onClose, 
  }
  ) => {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const onGenerate = async () => {
    setIsLoading(true);
    const flashcardService = new FlashcardService();
    try {
      const flashcards = await flashcardService.createFlashcard(selectedModel, 'note-id-placeholder');
      setFlashcards(flashcards);
      console.log('Flashcards generated:', flashcards);
      setIsLoading(false);
      setIsFinished(true);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg relative">
        {isLoading ? (
          <WaitGeneration onCancel={() => {
            setIsLoading(false);
            onClose();
          }} />
        ) : isFinished ? (
          <FlashcardModal
              isOpen={isFinished}
              onClose={() => {
                setIsFinished(false);
                onClose();
              } } cards={flashcards}          
           />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Generar Flashcards</h2>

            {/* Note Preview (hardcoded placeholder) */}
            <div className="border border-gray-200 rounded-md p-4 mb-4 max-h-40 overflow-y-auto">
              <h3 className="font-medium mb-2">Vista previa de la nota:</h3>
              <p className="text-gray-700 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
              </p>
            </div>

            {/* Dropdown for selecting model */}
            <div className="mb-6">
              <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar modelo de IA
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
                <option value="hf-flan-t5">HF Flan-T5</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                className="px-4 py-2 rounded-md"
                variant="studia-secondary">
                Cancelar
              </Button>
              <Button
                onClick={onGenerate}
                className="px-4 py-2 text-white rounded-md"
                variant="studia-primary">
                Generar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};