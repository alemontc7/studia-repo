import React from 'react';
import { Flashcard } from '../domain/flashcard';
import { useFlashcardSession } from './useFlashcardSession';
import { useSharedFlashcardSession } from './FlashcardSessionContext';
import { AnimatePresence, motion } from 'framer-motion';

const cardVariants = {
  enter: (direction: 'next' | 'previous') => ({
    x: direction === 'next' ? 300 : -300,
    opacity: 0,
    scale: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1], // Un ease suave
    },
  },
  exit: (direction: 'next' | 'previous') => ({
    x: direction === 'next' ? -300 : 300,
    opacity: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export const FlashcardDeck: React.FC = () => {
  const { currentCard, progress, direction } = useSharedFlashcardSession();
  console.log('Current Card:', currentCard);

  if (!currentCard) return null;

  return (
    <div className="w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col justify-center items-center border-r border-gray-200/50 overflow-hidden">
      <div className="relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-8 text-center">
          Your flashcards
        </h2>

        <div className="relative w-64 h-50 flex items-center justify-center">
          <div className="absolute -top-2 -left-2 w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 transform rotate-3" />
          <div className="absolute -top-1 -left-1 w-full h-full bg-white rounded-xl shadow-md border border-gray-150 transform rotate-1" />

          <AnimatePresence initial={false} custom={direction}>

          <motion.div
              key={currentCard.id}
              className="relative w-full h-full"
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >

          <div className="relative w-full h-full bg-white rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 overflow-hidden group">
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="w-8 h-1 bg-gradient-to-r from-[#0B87DC] to-green-500 rounded-full mb-4"></div>
                <p className="text-sm font-medium text-gray-800 leading-relaxed line-clamp-4">
                  {currentCard.challenge}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {currentCard.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-white text-[#0B87DC] text-xs rounded-full border border-[#0B87DC]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </motion.div>
          </AnimatePresence>
          
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Tarjeta {progress.current} de {progress.total}</p>
          <div className="w-32 h-1 bg-gray-200 rounded-full mt-2 mx-auto">
            <div 
              className="h-1 bg-gradient-to-r from-[#0B87DC] to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};