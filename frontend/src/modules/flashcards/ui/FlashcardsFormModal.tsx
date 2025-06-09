import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FlashcardService } from '../application/flashcardService';
import { FlashcardModal } from './FlashcardsResultModal';
import { WaitGeneration } from './waitGeneration';

// 1. Importamos o definimos los tipos que necesitamos.
import { Flashcard } from '../domain/flashcard';

// Creamos una interfaz para las notas, basada en cómo la usas.
interface Note {
  id: string;
  title: string;
  // Puedes añadir más propiedades si las necesitas
}

interface FlashcardsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId?: string;
  // 2. Usamos el tipo 'Note' en lugar de 'any[]'
  notes?: Note[]; 
}

export const FlashcardsFormModal: React.FC<FlashcardsFormModalProps> = ({ 
  isOpen, 
  onClose, 
  noteId = '',
  notes = []
}) => {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  // 3. Usamos el tipo 'Flashcard' en lugar de 'any[]'
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  // 4. Usamos el tipo 'Note | null' para una sola nota. Es más preciso que 'any'.
  const [myNote, setMyNote] = useState<Note | null>(null);

  useEffect(() => {
    // La lógica para encontrar y establecer la nota actual se mantiene,
    // pero ahora trabaja con tipos seguros.
    if (notes.length > 0 && noteId) {
      const note = notes.find(n => n.id === noteId);
      setMyNote(note || null); // Establece la nota o null si no se encuentra
    }
  }, [noteId, notes]); // Dependemos de noteId y notes

  const onGenerate = async () => {
    setIsLoading(true);
    const flashcardService = new FlashcardService();
    try {
      const generatedFlashcards = await flashcardService.createFlashcard(selectedModel, noteId);
      setFlashcards(generatedFlashcards);
      setIsLoading(false);
      setIsFinished(true);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setIsLoading(false);
    }
  };

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
            }}
            cards={flashcards}
          />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Generar Flashcards</h2>
            <div className="border border-gray-200 rounded-md p-4 mb-4 max-h-40 overflow-y-auto">
              <h3 className="font-medium mb-2">Se generará contenido para la nota:</h3>
              <p className="text-gray-700 text-sm">
                {/* 5. Usamos optional chaining (?.) por si 'myNote' es null */}
                {myNote?.title || 'Cargando información de la nota...'}
              </p>
            </div>
            {/* ... El resto del JSX no cambia ... */}
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
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="openai/gpt-4.1">GPT-4.1</option>
                <option value="xai/grok-3">Grok-3</option>
                <option value="cohere/cohere-command-a">Cohere command a</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                className="px-4 py-2 rounded-md"
                variant="studia-secondary"
              >
                Cancelar
              </Button>
              <Button
                onClick={onGenerate}
                className="px-4 py-2 text-white rounded-md"
                variant="studia-primary"
              >
                Generar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};