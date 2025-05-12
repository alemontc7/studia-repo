// src/modules/notes/ui/NotesContext.tsx

'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { NoteEntity } from '../domain/NoteEntity';
import { NotesService } from '../application/NotesService';
import { processSyncQueue } from '@/lib/sync'; // our background sync runner
import { set } from 'lodash';

/**
 * Shape of the context value exposed to consumers
 */
interface NotesContextValue {
  notes: NoteEntity[];
  selectedId: string | null;
  addNote: () => Promise<void>;
  selectNote: (id: string) => void;
  updateNote: (
    id: string,
    patch: Partial<Pick<NoteEntity, 'title' | 'content'>>,
    type: string
  ) => Promise<void>;
  deleteNote: (id: string) => void;
}

// Create a React Context for notes
const NotesContext = createContext<NotesContextValue | undefined>(undefined);

/**
 * Provider component that wraps the app (or part of it) and supplies notes state + actions
 */
export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<NoteEntity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [nextSync, setNextSync] = useState(10);
  const serviceRef = useRef(new NotesService());
  const service    = serviceRef.current;

  useEffect(() => {
    async function init() {
      const fetched = await service.fetchNotes();
      setNotes(fetched);
      if (fetched.length) {
        setSelectedId(fetched[0].id);
      }

      await processSyncQueue();
    }

    init();

    const interval = setInterval(processSyncQueue, 10_000);
    window.addEventListener('online', processSyncQueue);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', processSyncQueue);
    };
  }, [service]);

  
  const addNote = useCallback(async () => {
    const now = new Date().toISOString();
    const newNote: NoteEntity = {
      id: crypto.randomUUID(),
      title: 'Untitled note',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
    await service.createNote(newNote);
  }, [service]);

  const deleteNote = useCallback(
    (id: string) => {
      setNotes(prev => {
        const next = prev.filter(n => n.id !== id)
        if (selectedId === id) {
          const newSelected = next.length ? next[0].id : null
          setSelectedId(newSelected)
        }
        return next
      })
      service.deleteNote(id)
        .catch(err => {
          console.error('Error borrando nota:', err)
        })
    },
    [service, selectedId]
  )
  
  const selectNote = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const updateNote = useCallback(
    async (
      id: string,
      patch: Partial<Pick<NoteEntity, 'title' | 'content'>>,
      type: string
    ) => {
      console.log('id is', id);
      const updated = await service.fastUIUpdate(id, patch);
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
      await service.updateNote(updated, type);
    },
    [service]
  );

  return (
    <NotesContext.Provider
      value={{
        notes,
        selectedId,
        addNote,
        selectNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextValue => {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used within <NotesProvider>');
  }
  return ctx;
};
