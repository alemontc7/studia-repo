// frontend/src/modules/notes/ui/NotesContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { NoteEntity } from '../domain/NoteEntity';
import { NotesService } from '../application/NoteService';

interface NotesContextValue {
  notes: NoteEntity[];
  selectedId: string | null;
  addNote: () => Promise<void>;
  selectNote: (id: string) => void;
  updateNote: (id: string, patch: Partial<NoteEntity>) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<NoteEntity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // create service inside effect to be absolutely sure it's client-side
  useEffect(() => {
    const service = new NotesService();
    service.fetchNotes().then((fetched) => {
      setNotes(fetched);
      if (fetched.length) setSelectedId(fetched[0].id);
    });
  }, []);

  const addNote = useCallback(async () => {
    const service = new NotesService();
    const note = await service.createNote();
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  }, []);

  const selectNote = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const updateNote = useCallback(
    async (id: string, patch: Partial<NoteEntity>) => {
      const service = new NotesService();
      const updated = await service.updateNote(id, patch);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    },
    []
  );

  return (
    <NotesContext.Provider
      value={{ notes, selectedId, addNote, selectNote, updateNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextValue => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within <NotesProvider>');
  return ctx;
};
