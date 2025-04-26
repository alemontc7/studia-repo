'use client';

import React from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { Button } from '@/components/ui/button';
import { FileText as NoteIcon, TrashIcon } from 'lucide-react';

export default function Sidebar() {
  const { notes, selectedId, addNote, selectNote, deleteNote } = useNotes();

  return (
    <aside className="w-72 bg-[#1A1A1A] h-screen sticky top-0 pt-6 pr-6 pl-6 flex flex-col px-4">
      <Button
        onClick={addNote}
        className="w-full mb-6 rounded-[8px]"
        variant="studia-primary">
        New note
      </Button>
      <div>
        <h2 className="text-[15px] text-[#7B7B7B] font-bold mb-4">Notes</h2>
      </div>
      <ul className="overflow-y-auto flex-1 space-y-1">
      {notes.map((note) => {
          const isSelected = note.id === selectedId;
          return (
            <li key={note.id}
              className={`
                group flex items-center justify-between
                h-8 rounded px-2
              hover:bg-[#2E2E2E]
              ${isSelected ? 'bg-[#2E2E2E] text-white' : 'text-[#7B7B7B]'}
              `}
            >
              <button
                onClick={() => selectNote(note.id)}
                className={
                  `w-full flex items-center flex-1 h-full focus:outline-none`
                }
              >
                <NoteIcon className="w-4 h-4 mr-2" />
                <span className="truncate">{note.title}</span>
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="
                  p-1 ml-2
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 ease-in-out
                  focus:outline-none
                "
              >
                <TrashIcon className="w-4 h-4 text-gray-500" />
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
