'use cient';

import React, {createContext, useContext, useEffect, useState, ReactNode, useCallback} from 'react';
import { NoteEntity } from '../domain/NoteEntity';
import { NoteService } from '../application/NoteService';

interface NotesContextValue {
    notes: NoteEntity[];
    selectId: string | null;
    addNote: () => Promise<void>;
    selectNote: (id: string) => void;
    updateNote: (id: string, patch: Partial<NoteEntity>) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);
const noteService = new NoteService();

export const NotesProvider = ({children} : {children: ReactNode}) => {
    const [nodes, setNotes] = useState<NoteEntity[]>([]);
    const [selectId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        noteService.fetchNotes().then(fetched => {
            setNotes(fetched);
            if(fetched.length) setSelectedId(fetched[0].id);
        });
    }, []);

    const addNote = useCallback(async () => {
        const note = await noteService.createNote();
        setNotes(prev => [note, ...prev]);
        setSelectedId(note.id);
    }, []);

    const selectNode = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const updateNote = useCallback(
        async (id: string, patch: Partial<NoteEntity>) => {
            const updated = await noteService.updateNote(id, patch);
            setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
        },
    []);

    return (
        <NotesContext.Provider value={{ notes: nodes, selectId, addNote, selectNote: selectNode, updateNote }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = (): NotesContextValue => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};