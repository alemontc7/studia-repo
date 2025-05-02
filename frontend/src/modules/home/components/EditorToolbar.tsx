'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { Bold, Italic, List, Code, X } from 'lucide-react';
import '../styles/EditorToolbar.css';

interface ToolbarProps {
  editor: Editor | null;
  currentColor: string;
  setCurrentColor: (color: string) => void;
}

export default function EditorToolbar({ editor, currentColor, setCurrentColor }: ToolbarProps) {
  if (!editor) return null;


  const btnBase = `
    flex items-center justify-center
    w-8 h-8
    rounded-md
    transition-colors duration-150
  `;
  //up this
  //border border-gray-300

  return (
    <div className='sticky top-0 z-20 pb-8 pt-8'>
    <div className="flex space-x-2 items-center bg-white p-2 rounded-lg shadow-sm w-max mx-auto text-[#898989]">

      {/* Bold */}
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

      {/* Italic */}
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

      {/* Bullet List */}
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

      {/* Code Block */}
      {/* Code Block */}
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

      {/* Color Picker */}
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
          w-5 h-5            /* 32px square */
    p-0                /* no padding */
    rounded-full       /* full circle */
    appearance-none    /* strip default OS styling */
    cursor-pointer
    transition-opacity duration-150 hover:opacity-80
        "
      />
    </div>
    </div>
  );
}
