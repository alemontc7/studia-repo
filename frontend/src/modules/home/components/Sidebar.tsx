// frontend/src/app/home/components/Sidebar.tsx
'use client';

import React from 'react';
import { useNotes } from '@/modules/notes/ui/NotesContent';
import { Button } from '@/components/ui/button';
import { FileText as NoteIcon } from 'lucide-react';

export default function Sidebar() {
  const { notes, selectedId, addNote, selectNote } = useNotes();

  return (
    <aside className="w-60 bg-gray-100 h-screen sticky top-0 pt-6 flex flex-col px-4">
      {/* New Note button, a bit down from the very top */}
      <Button
        onClick={addNote}
        className="w-full mb-6 bg-black text-white hover:bg-gray-800"
      >
        New note
      </Button>

      {/* Notes list */}
      <ul className="overflow-y-auto flex-1 space-y-1">
        {notes.map((note) => (
          <li key={note.id}>
            <button
              className={`
                flex items-center w-full px-3 py-2 rounded 
                ${note.id === selectedId
                  ? 'bg-blue-200 font-semibold'
                  : 'hover:bg-gray-200'
                }
              `}
              onClick={() => selectNote(note.id)}
            >
              <NoteIcon className="w-4 h-4 mr-2 text-gray-600" />
              <span className="truncate">{note.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
