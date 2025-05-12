import { NoteEntity } from "../Domain/note.entity";
import { fetchNotesByUser,  } from "../Infrastructure/notes.repository";
import { upsertNote } from "../Infrastructure/notes.repository";
import { deleteNote } from "../Infrastructure/notes.repository";

export class NotesService {
  async fetchNotesByUser(userId: string): Promise<NoteEntity[]> {
    return fetchNotesByUser(userId);
  }

  async upsertNote(note: NoteEntity): Promise<NoteEntity> {
    return upsertNote(note);
  }

  async deleteNote(noteId: string): Promise<Boolean> {
    return deleteNote(noteId);
  }
}