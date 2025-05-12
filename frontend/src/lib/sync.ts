import { db, SyncOp } from './db';
import {
  createNoteApi,
  deleteNoteApi,
} from '@/modules/notes/infraestructure/noteApi';


export async function processSyncQueue(): Promise<void> {
  const ops: SyncOp[] = await db.syncQueue.toArray();

  for (const op of ops) {
    try {
      switch (op.type) {
        case 'upsert':
          if (op.note) {
            await createNoteApi(op.note);
          }
          break;

        case 'delete':
          if (op.noteId) {
            await deleteNoteApi(op.noteId);
          }
          break;
      }
      await db.syncQueue.delete(op.id);
    } catch (error) {
      console.error('Sync operation failed, will retry later', op, error);
    }
  }
}
