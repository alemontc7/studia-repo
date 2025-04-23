export interface NoteEntity {
    id: string;
    title: string;
    content: unknown;
    createdAt: Date;
    updatedAt: Date;
  }

export * from "./NoteEntity";