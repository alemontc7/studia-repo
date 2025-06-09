import { GraphicOrganizer } from "../domain/GraphicOrganizer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:7000/api';

export async function createGraphicOrganizer(noteId: string ): Promise<GraphicOrganizer> {
    const response = await fetch(`${API_BASE}/graphic-organizers/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ noteId }),
    credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating graphic organizer');
    }
    const data = await response.json();
    console.log("This is the data I fetched from the API", data);
    return data;
}

export async function getGraphicOrganizer(noteId: string): Promise<GraphicOrganizer>{
    const reponse = await fetch(`${API_BASE}/graphic-organizers/${noteId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    
    if (!reponse.ok) {
        const errorData = await reponse.json();
        throw new Error(errorData.message || 'Error fetching graphic organizer');
    }
    const data = await reponse.json();
    console.log("This is the data I fetched from the API", data);
    return data;
}