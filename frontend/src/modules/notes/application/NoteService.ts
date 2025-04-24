// frontend/src/modules/notes/application/NotesService.ts
import { NoteEntity } from '../domain/NoteEntity';
import { nanoid } from 'nanoid';
// (future) import { fetchNotesApi, createNoteApi, updateNoteApi } from '../infrastructure/notesApi';

export class NotesService {
  private static LS_KEY = 'notes';

  /** Load from localStorage (client only) */
  private loadStore(): NoteEntity[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(NotesService.LS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /** Persist to localStorage (client only) */
  private saveStore(notes: NoteEntity[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NotesService.LS_KEY, JSON.stringify(notes));
  }

  /** Fetch all notes */
  async fetchNotes(): Promise<NoteEntity[]> {
    // FUTURE: return fetchNotesApi();
    this.notes = this.loadStore();
    return this.notes;
  }

  /** Create a new note */
  async createNote(): Promise<NoteEntity> {
    // FUTURE: return createNoteApi({ title: 'Untitled note' });
    const now = new Date().toISOString();
    const note: NoteEntity = {
      id: nanoid(),
      title: 'Untitled note',
      content: null,
      createdAt: now,
      updatedAt: now,
    };
    this.notes = [note, ...this.loadStore()];
    this.saveStore(this.notes);
    return note;
  }

  /** Update an existing note */
  async updateNote(
    id: string,
    patch: Partial<Pick<NoteEntity, 'title' | 'content'>>
  ): Promise<NoteEntity> {
    // FUTURE: return updateNoteApi(id, patch);
    const stored = this.loadStore();
    let updated: NoteEntity | undefined;
    const newNotes = stored.map((n) => {
      if (n.id === id) {
        updated = { ...n, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      }
      return n;
    });
    if (!updated) throw new Error(`Note ${id} not found`);
    this.notes = newNotes;
    this.saveStore(this.notes);
    return updated;
  }

  /** In-memory cache to avoid repeated JSON.parse on create/update */
  private notes: NoteEntity[] = [];
}