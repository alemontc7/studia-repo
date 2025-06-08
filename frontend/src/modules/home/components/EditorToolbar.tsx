'use client';

import React, { use, useEffect, useState } from 'react';
import { type Editor } from '@tiptap/react';
import { Bold, Italic, List, Code, Layers, Plus} from 'lucide-react';
import '../styles/EditorToolbar.css';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { FlashcardsFormModal } from '@/modules/flashcards/ui/FlashcardsFormModal';
import { set } from 'lodash';
import { FlashcardService } from '../../flashcards/application/flashcardService';
import { FlashcardModal } from '@/modules/flashcards/ui/FlashcardsResultModal';

interface ToolbarProps {
  editor: Editor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

// This function would cause infinite recursion and should be removed or fixed
// If you need to extend or modify FlashcardService, do it in the service file itself

const flashcardService = new FlashcardService();

export default function EditorToolbar({ editor, currentColor, setCurrentColor }: ToolbarProps) {
  if (!editor) return null;

  const { isSaving, isSuccess, selectedId } = useNotes();
  const [showSaving, setShowSaving] = useState(false);
  const [flashcardsModalOpen, setFlashcardsModalOpen] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  
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
  }, [selectedId]);
  
  const hasFlashcards = flashcards.length > 0;

  useEffect(() =>{
    if(isSaving) {
      setShowSaving(true);
      setTimeout(() => {
        setShowSaving(false);
      }, 2000);
    }
  }, [isSaving]);

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
        <Plus className="w-3 h-3 text-green-500 absolute -top-1 -right-1"/>
      </button>
      <FlashcardsFormModal
        isOpen={flashcardsModalOpen}
        onClose={() => setFlashcardsModalOpen(false)}
        noteId={selectedId || ''}
      />

      <FlashcardModal
        isOpen={showFlashcards}
        onClose={() => {
          setShowFlashcards(false);
        }}
        cards={flashcards}
      />

      {/* Separador visual */}
      <div className="h-6 w-px bg-gray-300 mx-2"></div>
      
      {/* Indicador de guardado */}
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
