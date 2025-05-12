import { NoteEntity } from '../domain/NoteEntity';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:7000/api';

export async function fetchNotesApi(): Promise<NoteEntity[]> {
  const response = await fetch(`${API_BASE}/notes/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  console.log("I am fetching the notes"); 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching notes');
  }
  const data = (await response.json()) as NoteEntity[];
  const notesArray: NoteEntity[] = data.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })
  );
  return notesArray;
}

export async function createNoteApi(note: Omit<NoteEntity, 'userId'>): Promise<NoteEntity> {
  const res = await fetch(`${API_BASE}/notes/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error creating note');
  }

  const { saved_status: saved }: { saved_status: NoteEntity } = await res.json();
  return {
    id:        saved.id,
    title:     saved.title,
    content:   saved.content,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
  };
}


export async function updateNoteApi(
  note: Omit<NoteEntity, 'userId'>
): Promise<NoteEntity> {
  const res = await fetch(`${API_BASE}/notes/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || 'Error updating note');
  }
  const { saved_status: saved }: { saved_status: NoteEntity } = await res.json();
  return {
    id:        saved.id,
    title:     saved.title,
    content:   saved.content,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
  };
}


export async function deleteNoteApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/notes/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error deleting note');
  }
}
