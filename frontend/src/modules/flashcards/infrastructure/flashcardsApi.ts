import { Flashcard } from "../domain/flashcard";
import flashcards from "../stubs/flashcards.stub.json";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:7000/api';

//export async function fetchFlashcardsApi(): Promise<Flashcard[]> {
  //const response = await fetch(`${API_BASE}/flashcards/`, {
  //  method: 'GET',
  //  headers: { 'Content-Type': 'application/json' },
  //  credentials: 'include',
  //});
//
  //if (!response.ok) {
  //  const errorData = await response.json();
  //  throw new Error(errorData.message || 'Error fetching flashcards');
  //}
//
  //return response.json();
//}

export async function createFlashcardApi(noteId: string ,model: string): Promise<Flashcard[]> {
    const response = await fetch(`${API_BASE}/flashcards/`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ noteId, model }),
    credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating flashcard');
    }
    const data = await response.json();
    console.log("This is the data I fetched from the API", data);
    return data;
  //const response = await fetch(`${API_BASE}/flashcards/`, {
  //  method: 'POST',
  //  headers: { 'Content-Type': 'application/json' },
  //  body: JSON.stringify({ model, note }),
  //  credentials: 'include',
  //});
//
  //if (!response.ok) {
  //  const errorData = await response.json();
  //  throw new Error(errorData.message || 'Error creating flashcard');
  //}
  //return response.json();
  //return new Promise(resolve => {
  //  setTimeout(() => {
  //    console.log("Flashcards created with model:", model, "and noteId:", noteId);
  //    const results = flashcards.map((card, index) => ({
  //      ...card,
  //      id: `stub-${index}`,
  //      createdAt: new Date(),
  //      updatedAt: new Date()
  //    }));
  //    resolve(void(results));
  //  }, 5000);
  //});
}

export async function getFlashcardsApi(noteId: string): Promise<Flashcard[]>{
    const reponse = await fetch(`${API_BASE}/flashcards/${noteId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    
    if (!reponse.ok) {
        const errorData = await reponse.json();
        throw new Error(errorData.message || 'Error fetching flashcards');
    }
    const data = await reponse.json();
    console.log("This is the data I fetched from the API", data);
    return data;
}