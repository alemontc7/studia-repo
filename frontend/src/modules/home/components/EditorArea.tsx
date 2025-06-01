/* eslint-disable */
'use client';

import React, { useEffect, useRef, useState} from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { FloatImage } from '@/extensions/FloatImage';
import Gapcursor from '@tiptap/extension-gapcursor';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import EditorToolbar from './EditorToolbar';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight';
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import ImageResize from 'tiptap-extension-resize-image'
import '../styles/EditorArea.css';

function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export default function EditorArea() {
  const { notes, selectedId, addNote, updateNote } = useNotes();
  const current = notes.find((n) => n.id === selectedId);
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const prevSelectedIdRef = useRef<string | null>(null);
  const lowlight = createLowlight(all);
  const [currentColor, setCurrentColor] = useState<string>('#858585');


  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing…',
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
      }),
      FloatImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'float-image',
          style: 'max-width: 100%; height: auto; margin: 0 auto; display: block;',
        },
      }),
      ImageResize,
      Dropcursor.configure({ color: '#3B82F6' }),
      Gapcursor,
      CodeBlockLowlight.configure({
        lowlight,
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
                .setColor(currentColor)
                .run();
            };
            reader.readAsDataURL(file);
          });
          return true;
        }
        return false;
      },
      handleDrop(view, event, slice, moved) {
        if (moved) {
          return false;
        }
        const files = Array.from(event.dataTransfer?.files || []);
        if (files.length) {
          event.preventDefault();
          files.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
              editor
                ?.chain()
                .focus()
                .setImage({ src: reader.result as string })
                .setColor(currentColor)
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
      console.log('I am updating the note with ID ', selectedId);
      updateNote(selectedId, { content: editor.getJSON() }, 'content');
    },
    autofocus: false,
  });

  useEffect(() => {
    if (editor) {
      const updateListener = () => {
        // Apply current color to selection if needed
        if (currentColor && currentColor !== '#858585' && !editor.isActive('textStyle', { color: currentColor })) {
          editor.commands.setColor(currentColor);
        }
      };
      
      editor.on('focus', updateListener);
      editor.on('selectionUpdate', updateListener);
      
      return () => {
        editor.off('focus', updateListener);
        editor.off('selectionUpdate', updateListener);
      };
    }
  }, [editor, currentColor]);

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
      updateNote(selectedId, { title: newTitle }, 'title');
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
      <main className="flex-1 h-screen pl-32 pr-32 pb-32 flex flex-col overflow-y-auto">

        <EditorToolbar 
          editor={editor}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          onClick={() => setIsEditing(true)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTitleBlur();
              titleRef.current?.blur();
            }
          }}
          className={
            `text-[48px] 
            font-extrabold 
            mb-4 
            outline-none 
            text-[#858585]
            ${isEditing ? 'ring-2 ring-blue-300 pt-1 pb-1 pr-1 pl-4 rounded-[10px] transition-colors duration-300 ease-in-out' : ''} 
          `}
        >
          {current?.title ?? 'Untitled note'}
        </div>
        <div className="min-h-[60vh] tiptap prose w-full outline-none focus:outline-none">
          <EditorContent
            editor={editor}
            className="ProseMirror w-full outline-none focus:outline-none text-[20px] text-[#858585] font-normal"
          />
        </div>
      </main>
      <style jsx global>{`
      `}</style>
    </>
  );
}