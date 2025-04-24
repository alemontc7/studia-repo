'use client';

import React, { useEffect, useRef } from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function EditorArea() {
  const { notes, selectedId, updateNote } = useNotes();
  const current = notes.find((n) => n.id === selectedId);
  const prevSelectedIdRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start typing…' }),
    ],
    content: current?.content ?? '',
    onUpdate: ({ editor }) => {
      if (!selectedId) return;
      updateNote(selectedId, { content: editor.getJSON() });
    },
    autofocus: false, // We'll control focus manually
  });

  // Focus the editor when a new note is added (selectedId changes)
  useEffect(() => {
    if (editor && selectedId && selectedId !== prevSelectedIdRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        editor.commands.focus('end');
      }, 10);
      
      prevSelectedIdRef.current = selectedId;
    }
  }, [editor, selectedId]);

  // When a note is loaded, set its content
  useEffect(() => {
    if (editor && current) {
      editor.commands.setContent(current.content ?? '');
    }
  }, [editor, current]);

  if (!selectedId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Selecciona o crea una nota
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-semibold mb-4">{current?.title || 'Untitled Note'}</h2>
        <div className="min-h-[60vh]">
          <EditorContent
            editor={editor}
            className="ProseMirror w-full outline-none focus:outline-none"
          />
        </div>
        <div className="mt-2 text-sm text-blue-500">Saving…</div>
      </main>

      {/* Style for cursor visibility */}
      <style jsx global>{`
        .ProseMirror {
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          outline: none !important;
        }
        
        /* Enhanced cursor visibility */
        .ProseMirror .ProseMirror-cursor {
          border-left: 2px solid black !important;
          border-right: none !important;
          height: 1.15em;
          animation: blinkCursor 1s step-end infinite;
        }
        
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}