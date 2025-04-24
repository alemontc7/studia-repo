import { NoteEntity } from "../domain/NoteEntity";

TODO: "Implement the connection with the API to fetchNotes, createNotes, updatesNotes and so on";

/*
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL + '/notes';

export async function fetchNotesApi(): Promise<NoteEntity[]> {
  return fetch(`${API_BASE}`, { credentials: 'include' }).then(res => res.json());
}

export async function createNoteApi(data: CreateNoteDTO): Promise<NoteEntity> {
  return fetch(`${API_BASE}`, { method:'POST', body:JSON.stringify(data), ... }).then(res => res.json());
}

export async function updateNoteApi(id:string, data: UpdateNoteDTO): Promise<NoteEntity> {
  return fetch(`${API_BASE}/${id}`, { method:'PUT', body:JSON.stringify(data), ... }).then(res => res.json());
}
*/