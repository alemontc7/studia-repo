import { Request } from "express";

import { Response } from "express";
import { NotesService } from "../Application/notes.service";
import { NoteEntity } from "../Domain/note.entity";

export default class NotesController{

    private notesService = new NotesService();

    async saveNote(req: Request, res: Response): Promise<void>{
        try{
            const payload = req.body.note as NoteEntity;
            const userId = req.body.userId;
            payload.userId = userId;
            const saved = await this.notesService.upsertNote(payload);
            res.status(201).json({
                saved_status: saved
            });
        } catch(error:any){
            res.status(400).json({
                message: error.message || 'Error al guardar la nota'
            });
        }
    }

    async getNotes(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.body.userId;
            console.log("THE USER ID PREVIOUS THE CALL OF FETCH NOTES BY USER IS", userId);
            const notes = await this.notesService.fetchNotesByUser(userId);
            console.log("Notes fetched", notes);
            res.status(200).json(notes);
        }
        catch(error:any){
            res.status(400).json({
                message: error.message || 'Error while fetching notes'
            });
        }
    }

    async deleteNote(req: Request,res: Response): Promise<void>{
        try{
            const noteId = req.body.id;
            const deleted = await this.notesService.deleteNote(noteId);
            res.status(200).json({
                deleted_status: deleted
            });
        }
        catch(error:any){
            res.status(400).json({
                    message: error.message || 'Error while deleting note'
            });
        }
    }
}