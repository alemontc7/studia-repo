import { NoteEntity } from "../Domain/note.entity";
import { supabase } from "../../../config/supabaseClient";

export async function fetchNotesByUser(userId: string): Promise<NoteEntity[]>{
  console.log("THE ID WAS", userId);
    const {data, error} = await supabase
        .from('notes')
        .select('id, user_id, title, content, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: true });
    console.log("THE DATA IS", data);
    if (error) {
        console.error("Error fetching notes:", error);
        throw new Error("Error fetching notes");
    }

    return (
        data as Array<{
            id: string;
            user_id: string;
            title: string;
            content: any;
            created_at: string;
            updated_at: string;
        }>
    ).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        content: row.content,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
}

export async function upsertNote(
    note: NoteEntity
  ): Promise<NoteEntity> {
    const { data, error } = await supabase
      .from('notes')
      .upsert(
        {
          id:         note.id,
          user_id:    note.userId,
          title:      note.title,
          content:    note.content,
          created_at: note.createdAt,
          updated_at: note.updatedAt,
        },
        {} 
      )
      .select('*')
      .single();
  
    if (error) throw error;
  
    return {
      id:        data.id,
      userId:    data.user_id,
      title:     data.title,
      content:   data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
  

export async function deleteNote(noteId: string): Promise<Boolean>{
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

    if (error) {
        throw error;
    }
    return true;
}