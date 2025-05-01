import { NoteEntity } from '../domain/NoteEntity';
import { nanoid } from 'nanoid';
// (future) import { fetchNotesApi, createNoteApi, updateNoteApi } from '../infrastructure/notesApi';

export class NotesService {
  private static LS_KEY = 'notes';

  private loadStore(): NoteEntity[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(NotesService.LS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveStore(notes: NoteEntity[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NotesService.LS_KEY, JSON.stringify(notes));
  }

  async fetchNotes(): Promise<NoteEntity[]> {
    // FUTURE: return fetchNotesApi();
    this.notes = this.loadStore();
    return this.notes;
  }

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

  async deleteNote(id: string): Promise<void> {
    const stored = this.loadStore();
    this.notes = stored.filter((n) => n.id !== id);
    this.saveStore(this.notes);
  }
  async updateNote(
    id: string,
    patch: Partial<Pick<NoteEntity, 'title' | 'content'>>
  ): Promise<NoteEntity> {
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
  private notes: NoteEntity[] = [];
}