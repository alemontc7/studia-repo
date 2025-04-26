/* eslint-disable */
'use client';

import React, { useEffect, useRef, useState} from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import Image from '@tiptap/extension-image';

export default function EditorArea() {
  const { notes, selectedId, addNote, updateNote, deleteNote } = useNotes();
  const current = notes.find((n) => n.id === selectedId);
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const prevSelectedIdRef = useRef<string | null>(null);
  

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing…',
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: current?.content ?? '',
    editorProps: {
      attributes: {
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
        autocomplete: 'off',
      },
      handlePaste(view, event) {
        const files = event.clipboardData?.files;
        if (files?.length) {
          Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
              editor
                ?.chain()
                .focus()
                .setImage({ src: reader.result as string })
                .run();
            };
            reader.readAsDataURL(file);
          });
          return true;
        }
        return false;
      },
      handleDrop(view, event, slice, moved) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files?.length) {
          Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
              editor
                ?.chain()
                .focus()
                .setImage({ src: reader.result as string })
                .run();
            };
            reader.readAsDataURL(file);
          });
          return true;
        }
        return false;
      },
    },

    onUpdate: ({ editor }) => {
      if (!selectedId) return;
      updateNote(selectedId, { content: editor.getJSON() });
    },
    autofocus: false,
  });

  useEffect(() => {
    if (editor && selectedId && selectedId !== prevSelectedIdRef.current) {
      setTimeout(() => {
        editor.commands.focus('end');
      }, 10);
      prevSelectedIdRef.current = selectedId;
    }
  }, [editor, selectedId]);

  useEffect(() => {
    if (!editor || !current) return;
    editor.commands.setContent(current.content ?? '');
    editor.commands.focus('end');
  }, [editor, selectedId]);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedId]);

  const handleTitleBlur = () => {
    setIsEditing(false);
    const newTitle = titleRef.current?.innerText.trim() ?? '';
    if (selectedId && newTitle !== current?.title){
      updateNote(selectedId, {title: newTitle});
    }
  };


  if (!selectedId) {
    return (
      <main className="min-h-screen flex-1 p-32 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-extrabold text-gray-400">
            You don't have notes yet
          </h2>
          <p className="text-xl text-gray-500">
            Selecciona o crea una nota para empezar a escribir.
          </p>
          <Button
          onClick={addNote}
          className="w-40 rounded-[8px] h-10"
          variant="studia-primary">
            New note
          </Button>
        </div>
      </main>
    );
  }
  

  return (
    <>
      <main className="flex-1 p-32">
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          onClick={() => setIsEditing(true)}
          onBlur={handleTitleBlur}
          className={
            `text-[48px] 
            font-extrabold 
            mb-4 
            outline-none 
            text-[#858585]
            ${isEditing ? 'ring-2 ring-blue-300 p-1 rounded-[10px] transition-colors duration-300 ease-in-out' : ''} 
          `}
        >
          {current?.title ?? 'Untitled Note'}
        </div>
        <div className="min-h-[60vh]">
        <EditorContent
        editor={editor}
        className="ProseMirror w-full outline-none focus:outline-none text-[20px] text-[#858585] font-normal"
        />

        </div>
      </main>
      <style jsx global>{`
        .ProseMirror {
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          outline: none !important;
          position: relative;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #DBDBDB;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror .ProseMirror-cursor {
          border-left: 2px solid black !important;
          border-right: none !important;
          height: 1.15em;
          animation: blinkCursor 2s step-end infinite;
        }
        
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}