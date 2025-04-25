'use client';

import React from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { Button } from '@/components/ui/button';
import { FileText as NoteIcon } from 'lucide-react';

export default function Sidebar() {
  const { notes, selectedId, addNote, selectNote } = useNotes();

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
            <li key={note.id}>
              <button
                onClick={() => selectNote(note.id)}
                className={`
                  flex items-center w-full h-8 rounded px-2
                  ${isSelected
                    ? 'bg-[#2A2A2A] text-white'
                    : 'hover:bg-[#2E2E2E] text-gray-300'
                  }
                `}
              >
                <NoteIcon className="w-4 h-4 mr-2" />
                <span className="truncate">{note.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
