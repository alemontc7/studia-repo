import { db, SyncOp } from './db';
import {
  createNoteApi,
  deleteNoteApi,
} from '@/modules/notes/infraestructure/noteApi';


interface SyncResult {
  successes: number;
  failures: number;
  lastStatus: number;
}

export async function isQueueEmpty(): Promise<boolean>{
  const ops: SyncOp[] = await db.syncQueue.toArray();
  return ops.length === 0;
}

export async function processSyncQueue(): Promise<boolean> {
  const ops: SyncOp[] = await db.syncQueue.toArray();
  let bool = true;
  for (const op of ops) {
    try {
      switch (op.type) {
        case 'upsert':
          if (op.note) {
            try {
              await createNoteApi(op.note);
              bool = true;
            } catch (err: unknown) {
              bool = false;
              return false;
            }
          }
          break;

        case 'delete':
          if (op.noteId) {
            try {
              await deleteNoteApi(op.noteId);
              bool = true;
            } catch (err: unknown) {
              bool = false;
              return false;
            }
          }
          break;
      }
      await db.syncQueue.delete(op.id);
      bool = true;
    } catch (error) {
      console.error('Sync operation failed, will retry later', op, error);
      bool = false;
    }
  }
  console.log("bool is ", bool);
  return bool;
}
