import { Flashcard } from "../domain/flashcard";
import flashcards from "../stubs/flashcards.stub.json";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:7000/api';

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