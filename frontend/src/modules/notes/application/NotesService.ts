import { NoteEntity } from "../domain/NoteEntity";
import {
  fetchNotesApi,
  deleteNoteApi,
  updateNoteApi,
  createNoteApi,
} from '../infraestructure/noteApi';
import {db, SyncOp} from '@/lib/db';

export class NotesService {
  constructor() {
    this.loadFromIndexedDB().then(notes => {
      this.notes = notes;
    });
  }

  private notes: NoteEntity[] = [];

  private async loadFromIndexedDB(): Promise<NoteEntity[]>{
    return await db.notes.toArray();
  }

  private async upsertLocal(note: NoteEntity) {
    await db.notes.put(note);
    const op: SyncOp = {
      id: note.id,
      type: 'upsert',
      note,
      attemptedAt: new Date(),
    };
    await db.syncQueue.put(op);
  }

  async fetchNotes(): Promise<NoteEntity[]>{
    try{
      const remote = await fetchNotesApi();
      await db.notes.clear();
      await db.notes.bulkPut(remote);
      this.notes = remote;
      return remote;
    } catch (err) {
      console.warn('Fetch failed, using local IndexDB', err);
      const local = await db.notes.toArray();
      this.notes = local;
      return local;
    }
  }

  async createNote(note: NoteEntity): Promise<void> {
    await db.notes.put(note);
    this.notes = [note, ...this.notes];
    await createNoteApi(note);
  }

  async fastFetchNotes(): Promise<NoteEntity[]> { 
    const local = await db.notes.toArray();
    this.notes = local;
    return local;
  }

  async deleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
    this.notes = this.notes.filter(n => n.id !== id);
    await deleteNoteApi(id);
  }

  async fastUIUpdate(
    id: string, 
    patch: Partial<Pick<NoteEntity, 'title' | 'content'>>
  ): Promise<NoteEntity> {
    console.log('fastUIUpdate called with id:', id, 'and patch:', patch);
    const existing = this.notes.find(n => n.id === id)!;
    console.log("THIS IS THE EXISTING NOTE INSIDE THE fastUIUpdate FUNCTION:", existing);
    console.log("THIS ARE THE NOTES", this.notes);
    const updated: NoteEntity = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    console.log('THIS IS THE UPDATED NOTE INSIDE THE fastUIUpdate FUNCTION:', updated);
    this.notes = this.notes.map(n => (n.id === id ? updated : n));
    return updated;
  }

  async updateNote(
    note: NoteEntity,
    type: string,
  ): Promise<void> {
    this.notes = this.notes.map(n => (n.id === note.id ? note : n));
    if (type === 'content') {
      await this.upsertLocal(note);
    } else if (type === 'title') {
      await updateNoteApi(note);
    }
  }
};