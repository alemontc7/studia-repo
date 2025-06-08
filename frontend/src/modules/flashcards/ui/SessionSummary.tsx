import React from 'react';
import { Award, Timer, CheckCircle2, BookOpen } from 'lucide-react';
import { SessionStats } from '../domain/flashcard';

interface SessionSummaryProps {
  stats: SessionStats;
  onClose?: () => void;
}

const formatTime = (startTime: number, endTime: number | null) => {
  if (!endTime) return '00:00';
  const diffInSeconds = Math.round((endTime - startTime) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const SessionSummary: React.FC<SessionSummaryProps> = ({ stats, onClose }) => {
  const totalTime = formatTime(stats.startTime, stats.endTime);
  const accuracy = stats.questionsAttempted > 0 
    ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg">
      <Award className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
      <h2 className="text-3xl font-bold text-gray-800 mt-4">¡Sesión Completada!</h2>
      <p className="text-gray-600 mt-2">¡Gran trabajo! Aquí está tu resumen:</p>

      <div className="grid grid-cols-2 gap-6 mt-10 w-full max-w-md">
        <div className="bg-white p-4 rounded-lg shadow-sm text-left">
          <div className="flex items-center text-gray-500">
            <Timer className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Tiempo Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalTime}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm text-left">
          <div className="flex items-center text-gray-500">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Precisión</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{accuracy}%</p>
          <p className="text-xs text-gray-500">({stats.questionsCorrect} de {stats.questionsAttempted} correctas)</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm text-left col-span-2">
          <div className="flex items-center text-gray-500">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Conceptos Repasados</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.conceptualCardsReviewed}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-12 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        Finalizar Sesión
      </button>
    </div>
  );
};