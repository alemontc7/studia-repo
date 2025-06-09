import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LoaderCircle } from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  mermaidCode: string | null;
  error: string | null;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  mermaidCode,
  error,
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
            className="bg-white rounded-2xl w-[90%] max-w-4xl h-[85vh] shadow-2xl relative flex flex-col border border-gray-200/50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 flex-1 flex items-center justify-center overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-gray-600">
                  <LoaderCircle className="w-12 h-12 animate-spin" />
                  <p className="text-lg font-medium">Generando organizador...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600">
                  <p><strong>Error</strong></p>
                  <p>{error}</p>
                </div>
              ) : mermaidCode ? (
                <MermaidDiagram chart={mermaidCode} />
              ) : null}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};