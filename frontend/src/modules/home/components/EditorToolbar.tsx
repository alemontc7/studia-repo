'use client';

import React, { useEffect, useState } from 'react';
import { type Editor } from '@tiptap/react';
import { Bold, Italic, List, Code} from 'lucide-react';
import '../styles/EditorToolbar.css';
import { useNotes } from '@/modules/notes/ui/NotesContent';

interface ToolbarProps {
  editor: Editor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}



/*

<div className="relative h-6 mb-2">
  {showSaving ? (
    <span className="sticky bottom-0 left-0 text-blue-500 animate-pulse font-bold transition-opacity duration-1000 ease-in-out bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100 z-50">
      Saving…
    </span>
  ) : (
    <span className="sticky bottom-0 left-0 text-blue-300 font-medium transition-opacity duration-1000 ease-in-out bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100 z-50">
      Saved
    </span>
  )}
</div>

*/

export default function EditorToolbar({ editor, currentColor, setCurrentColor }: ToolbarProps) {
  if (!editor) return null;

  const { notes, selectedId, addNote, updateNote, isSaving, nextSaveIn } = useNotes();
const [showSaving, setShowSaving] = useState(false);

  useEffect(() =>{
    if(isSaving) {
      setShowSaving(true);
      const timer = setTimeout(() => {
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
    
      {/* Separador visual */}
      <div className="h-6 w-px bg-gray-300 mx-2"></div>
      
      {/* Indicador de guardado */}
      {showSaving ? (
        <span className="text-blue-500 animate-pulse font-medium text-sm px-2">
          Saving…
        </span>
      ) : (
        <span className="text-green-500 font-medium text-sm px-2">
          Saved
        </span>
      )}
    
    </div>
    </div>
  );
}
