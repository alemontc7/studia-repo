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
import { isQueueEmpty } from '@/lib/sync';
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
  isSaving: boolean;
  nextSaveIn: number;
}

// Create a React Context for notes
const NotesContext = createContext<NotesContextValue | undefined>(undefined);

/**
 * Provider component that wraps the app (or part of it) and supplies notes state + actions
 */
export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<NoteEntity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // countdown (in seconds) until the next scheduled sync
  const [nextSaveIn, setNextSaveIn] = useState(10);
  const serviceRef = useRef(new NotesService());
  const service    = serviceRef.current;

  const runSync = useCallback(async () => {
    const queueEmpty = await isQueueEmpty();
    if (queueEmpty) {
      setIsSaving(false);
      return;
    }
    setIsSaving(true);
    try {
      await processSyncQueue();
    } finally {
      setIsSaving(false);
    }
  }, []);

  // initial load + periodic sync
  useEffect(() => {
    // fetch from server (or fallback to IndexedDB) then sync any pending ops
    service.fetchNotes().then(fetched => {
      setNotes(fetched);
      if (fetched.length) {
        setSelectedId(fetched[0].id);
      }
      runSync();
    });

    // every 10s, retry sync; also on browser re-connection
    const interval = setInterval(runSync, 10_000);
    window.addEventListener('online', runSync);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', runSync);
    };
  }, [service, runSync]);

  // countdown timer whenever we're not in the middle of saving
  useEffect(() => {
    // reset counter to full interval
    setNextSaveIn(10);
    if (!isSaving) {
      let counter = 10;
      const timer = setInterval(() => {
        counter -= 1;
        setNextSaveIn(counter);
        if (counter <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSaving]);

  
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
      const updated = await service.fastUIUpdate(id, patch);
      setNotes(prev => {
        const others = prev.filter(n => n.id !== id);
        return [updated, ...others];
      });
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
        isSaving,
        nextSaveIn
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
