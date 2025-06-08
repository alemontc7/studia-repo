// view/components/flashcard/FlashcardModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FlashcardDeck } from './FlashcardDeck';
import { FlashcardViewer } from './FlashcardViewer';
import { FlashcardNavigation } from './FlashcardNavigation';
import { Flashcard } from '../domain/flashcard'
import { FlashcardSessionProvider } from './FlashcardSessionContext';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Flashcard[];
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ 
  isOpen, 
  onClose, 
  cards 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-[90%] max-w-5xl h-[85vh] shadow-2xl relative flex border border-gray-200/50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <FlashcardSessionProvider cards={cards}>
                <FlashcardDeck />
                <div className="w-3/5 p-8 flex flex-col">
                        <FlashcardViewer />
                        <FlashcardNavigation />
                </div>
            </FlashcardSessionProvider>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};