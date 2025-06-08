import React from 'react';
import { ClipLoader as Spinner } from 'react-spinners';
import { Button } from '@/components/ui/button';

interface WaitGenerationProps {
  onCancel: () => void;
}

export const WaitGeneration: React.FC<WaitGenerationProps> = ({ onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <Spinner className="w-16 h-16 text-blue-600 mb-8" />
      
      <p className="text-lg text-gray-700 text-center mb-12 max-w-md">
        Generando flashcards, por favor espera...
      </p>
      
      <Button
        onClick={onCancel}
        variant="studia-secondary"
        className="px-8 py-2"
      >
        Cancelar
      </Button>
    </div>
  );
};