'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import { type Editor } from '@tiptap/react';
import { Bold, Italic, List, Code, Layers, Plus, Network} from 'lucide-react';
import '../styles/EditorToolbar.css';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { FlashcardsFormModal } from '@/modules/flashcards/ui/FlashcardsFormModal';
import { set } from 'lodash';
import { FlashcardService } from '../../flashcards/application/flashcardService';
import { FlashcardModal } from '@/modules/flashcards/ui/FlashcardsResultModal';
import { GraphicOrganizerService } from '@/modules/graphicOrganizers/application/graphicOrganizerService';
import { OrganizerModal } from '@/modules/graphicOrganizers/ui/OrganizerModal';
import { Flashcard } from '@/modules/flashcards/domain/flashcard';

interface ToolbarProps {
  editor: Editor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}


export default function EditorToolbar({ editor, currentColor, setCurrentColor }: ToolbarProps) {
  const { isSaving, isSuccess, selectedId, notes } = useNotes();
  const [showSaving, setShowSaving] = useState(false);
  const [flashcardsModalOpen, setFlashcardsModalOpen] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // Usamos el tipo correcto
  
  const flashcardService = useMemo(() => new FlashcardService(), []);
  const organizerService = useMemo(() => new GraphicOrganizerService(), []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlashcards() {
      if (selectedId) {
        const cards = await flashcardService.getFlashcards(selectedId);
        setFlashcards(cards);
      } else {
        setFlashcards([]);
      }
    }
    fetchFlashcards();
  }, [selectedId, flashcardService]);

  const hasFlashcards = flashcards.length > 0;

  useEffect(() => {
  if (isSaving) {
    setShowSaving(true);
  } else if (showSaving) {
    const timer = setTimeout(() => {
      setShowSaving(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }
}, [isSaving, showSaving]);


  if (!editor) {
    return null; 
  }
  
  const handleOpenOrganizer = async () => {
    setIsModalOpen(true);
    setError(null);
    setIsLoading(true);
    try {
      const existingOrganizer = await organizerService.obtainGraphicOrganizer(selectedId || '');
      setMermaidCode(existingOrganizer.mermaidCode);
    } catch (e) {
      try {
        const newOrganizer = await organizerService.makeGraphicOrganizer(selectedId || '');
        setMermaidCode(newOrganizer.mermaidCode);
      } catch (creationError: unknown) {
        if (creationError instanceof Error) {
            setError(creationError.message);
        } else {
            setError("No se pudo generar el organizador.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMermaidCode(null); 
  };

  const btnBase = `
    flex items-center justify-center
    w-8 h-8
    rounded-md
    transition-colors duration-150
  `;

  return (
    <div className='sticky top-0 z-20 pb-8 pt-8'>
    <div className="flex space-x-2 items-center bg-white p-2 rounded-lg shadow-sm w-max mx-auto text-[#898989]">

      <button
        onClick={() => editor.chain().focus().toggleBold().setColor(currentColor).run()}
        className={`
          ${btnBase}
          ${editor.isActive('bold') ? 'bg-[#E7E7E7] text-[#000000]' : 'hover:bg-gray-100 '}
        `}
        aria-label="Toggle bold"
      >
        <Bold className="w-5 h-5" />
      </button>
        
      <button
        onClick={() => editor.chain().focus().toggleItalic().setColor(currentColor).run()}
        className={`
          ${btnBase}
          ${editor.isActive('italic') ? 'bg-[#E7E7E7] text-[#000000]' : 'hover:bg-gray-100'}
        `}
        aria-label="Toggle italic"
      >
        <Italic className="w-5 h-5" />
      </button>
        
      <button
        onClick={() => editor.chain().focus().toggleBulletList().setColor(currentColor).run()}
        className={`
          ${btnBase}
          ${editor.isActive('bulletList') ? 'bg-[#E7E7E7] text-[#000000]' : 'hover:bg-gray-100'}
        `}
        aria-label="Toggle bullet list"
      >
        <List className="w-5 h-5" />
      </button>
        
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().setColor(currentColor).run()}
        className={`
          ${btnBase}
          ${editor.isActive('codeBlock') ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'}
        `}
        aria-label="Toggle code block"
      >
        <Code className="w-5 h-5" />
      </button>
        
      <input
        type="color"
        value={currentColor}
        onInput={(e) => {
          const color = (e.target as HTMLInputElement).value;
          setCurrentColor(color);
          editor.chain().focus().setColor(color).run();
        }}
        aria-label="Text color"
        className="
          w-5 h-5           
          p-0                
          rounded-full       
          appearance-none   
          cursor-pointer
          transition-opacity duration-150 hover:opacity-80
        "
      />

      <button
        onClick={() => 
          {
            console.log("CLICK ON GENERATE FLASHCARDS");
            if(!hasFlashcards) {
              setFlashcardsModalOpen(true);
            } else{
              setShowFlashcards(true);
            }
          }
        }
        className={`
          ${btnBase}
          ${false ? "bg-blue-100 text-blue-500 animate-pulse" : "hover:bg-gray-100"}
          relative flex items-center
        `}
        aria-label="Generar flashcards"
      >
        <Layers className="w-5 h-5 text-gray-700" />
      </button>
      <FlashcardsFormModal
        isOpen={flashcardsModalOpen}
        onClose={() => setFlashcardsModalOpen(false)}
        noteId={selectedId || ''}
        notes={notes}
      />

      <FlashcardModal
        isOpen={showFlashcards}
        onClose={() => {
          setShowFlashcards(false);
        }}
        cards={flashcards}
      />

      <button
        onClick={handleOpenOrganizer}
        className="p-2 rounded-lg relative flex items-center hover:bg-gray-100"
        aria-label="Generar organizador gráfico"
      >
        <Network className="w-5 h-5 text-gray-700" />
      </button>

      <OrganizerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoading}
        mermaidCode={mermaidCode}
        error={error}
      />

      <div className="h-6 w-px bg-gray-300 mx-2"></div>
      
      {showSaving ? (
        <span className="text-blue-500 animate-pulse font-medium text-sm px-2">
          Saving…
        </span>
      ) : isSuccess ? (
        <span className="text-green-500 font-medium text-sm px-2">
          Saved
        </span>
      ) : (
        <span className="text-red-500 animate-pulse font-medium text-sm px-2">
          Retrying...
        </span>
      )}

    </div>
    </div>
  );
}
