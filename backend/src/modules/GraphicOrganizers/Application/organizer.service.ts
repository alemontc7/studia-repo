import { GraphicOrganizer } from "../Domain/organizer.entity";
import { fetchOrganizerByNoteId, generateGraphicOrganizer } from "../Infrastructure/organizer.repository";

export class GraphicOrganizerService {
  async generateOrganizer(noteId: string): Promise<GraphicOrganizer> {
    return generateGraphicOrganizer(noteId);
  }

  async getOrganizerByNoteId(noteId: string): Promise<GraphicOrganizer | null> {
    return fetchOrganizerByNoteId(noteId);
  }
}