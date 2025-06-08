import React, { use } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFlashcardSession } from './useFlashcardSession';
import { useSharedFlashcardSession } from './FlashcardSessionContext';

export const FlashcardNavigation: React.FC = () => {
  const { progress, goToPrevious, goToNext, canGoToPrevious, canGoToNext } = useSharedFlashcardSession();

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={goToPrevious}
        disabled={!canGoToPrevious}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Anterior</span>
      </button>
      
      <button
        onClick={goToNext}
        disabled={!canGoToNext}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#0B87DC] to-[#0B87DC] text-white rounded-xl hover:from-[#0B87DC] hover:to-green-500 transition-all ease-out duration-1000 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};