// frontend/src/modules/notes/infraestructure/noteApi.ts

import { NoteEntity } from '../domain/NoteEntity';

/**
 * TODO: implement with real fetch() calls in the next sprint.
 */
export async function fetchNotesApi(): Promise<NoteEntity[]> {
  // stub: returns empty until backend is wired
  return [];
}

export async function createNoteApi(): Promise<NoteEntity> {
  // stub: throw so you notice if someone actually calls it
  throw new Error('createNoteApi not implemented');
}

export async function updateNoteApi(): Promise<NoteEntity> {
  throw new Error('updateNoteApi not implemented');
}
