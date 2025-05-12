import Dexie, { Table } from 'dexie';
import { NoteEntity } from '@/modules/notes/domain/NoteEntity';

export interface SyncOp {
  id: string;
  type: 'upsert' | 'delete';
  note?: NoteEntity;
  noteId?: string;
  attemptedAt: Date;
}

export class AppDB extends Dexie {
  public notes!: Table<NoteEntity, string>;
  public syncQueue!: Table<SyncOp, string>;

  constructor() {
    super('NotesAppDB');
    this.version(1).stores({
      notes: 'id, updatedAt',
      syncQueue: 'id, type, attemptedAt',
    });
    this.notes = this.table('notes');
    this.syncQueue = this.table('syncQueue');
  }
}

export const db = new AppDB();
