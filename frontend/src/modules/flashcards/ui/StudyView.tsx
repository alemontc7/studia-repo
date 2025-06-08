import React from 'react';
import { useSharedFlashcardSession } from './FlashcardSessionContext';
import { FlashcardDeck } from './FlashcardDeck';
import { FlashcardViewer } from './FlashcardViewer';
import { FlashcardNavigation } from './FlashcardNavigation';
import { SessionSummary } from './SessionSummary';
import { AnimatePresence, motion } from 'framer-motion';

interface StudyViewProps {
  onClose?: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ onClose }) => {
  const { isSessionCompleted, stats } = useSharedFlashcardSession();

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {isSessionCompleted && stats ? (
          <motion.div
            key="summary"
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <SessionSummary stats={stats} onClose={onClose} />
          </motion.div>
        ) : (
          <motion.div
            key="study-area"
            className="flex w-full h-full"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FlashcardDeck />
            <div className="w-3/5 p-8 flex flex-col">
              <FlashcardViewer />
              <FlashcardNavigation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};