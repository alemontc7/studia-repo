import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Flashcard } from '../domain/flashcard';

interface ConceptualCardFaceProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export const ConceptualCardFace: React.FC<ConceptualCardFaceProps> = ({
  card,
  isFlipped,
  onFlip
}) => {
  return (
    <div
      className="relative w-full h-80 cursor-pointer"
      onClick={onFlip}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face - Challenge */}
        <div
          className="absolute w-full h-100 bg-gradient-to-br from-[#0B87DC]/5 to-[#0B87DC]/10 rounded-2xl shadow-xl border border-[#0B87DC]/5 overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="p-15 h-full flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0B87DC]/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#0B87DC]/20 to-transparent rounded-tr-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Concepto</h3>
                
              </div>
              
              <p className="text-gray-800 text-lg leading-relaxed">
                {card.challenge}
              </p>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 mb-2">Haz clic para ver la respuesta</p>
              <div className="w-16 h-1 bg-gradient-to-r from-[#0B87DC] to-[#0B87DC] rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Back Face - Solution */}
        <div
          className="absolute w-full h-100 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="p-8 h-full flex flex-col justify-center relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Respuesta</h3>
                <div className="p-2 bg-white/70 backdrop-blur-sm rounded-lg">
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {card.solution}
                </p>
                
                {card.contextSnippet && (
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#0B87DC]">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {card.contextSnippet}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 mb-2">Haz clic para volver</p>
              <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};