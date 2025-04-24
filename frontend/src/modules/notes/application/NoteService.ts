import { NoteEntity } from "../domain/NoteEntity";
import {nanoid} from "nanoid";
//import {fetchNotesApi, createNoteApi, updateNoteApi} from "../infrastructure/noteApi";

export class NoteService {
    private static LS_KEY = 'notes';
    private notes: NoteEntity[];

    constructor(){
        const raw = localStorage.getItem(NoteService.LS_KEY);
        this.notes = raw ? JSON.parse(raw) : [];
        // this.notes = await fetchNotesApi(); // Uncomment this line when the API is ready
    }

    private persist(){
        localStorage.setItem(NoteService.LS_KEY, JSON.stringify(this.notes));
    }

    async fetchNotes(): Promise<NoteEntity[]> {
        // const response = await fetchNotesApi(); // Uncomment this and the next line when the API is ready
        // this.notes = response;
        return this.notes;
    }

    async createNote(): Promise<NoteEntity>{
        const now = new Date().toISOString();
        const note: NoteEntity = {
            id: nanoid(),
            title: 'New Note',
            content: 'Write something...',
            createdAt: now,
            updatedAt: now,
        };
        this.notes = [note, ...this.notes];
        this.persist();
        return note;
        // const response = await createNoteApi(note); // Uncomment this line when the API is ready
    }

    async updateNote(
        id:string,
        patch: Partial<Pick<NoteEntity, 'id' | 'createdAt'>>
    ): Promise<NoteEntity> {
        let updated: NoteEntity | undefined;
        this.notes = this.notes.map(n => {
            if(n.id === id){
                updated = { ...n, ...patch, updatedAt: new Date().toISOString() };
                return updated;
            }
            return n;
        });
        this.persist();
        // const response = await updateNoteApi(id, updated); // Uncomment this line when the API is ready
        if(!updated){
            throw new Error(`Note with id ${id} not found`);
        }
        return updated;
    }
}