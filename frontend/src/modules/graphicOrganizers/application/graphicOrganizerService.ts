import { GraphicOrganizer } from "../domain/GraphicOrganizer";
import { createGraphicOrganizer, getGraphicOrganizer } from "../infrastructure/graphicOrganizersApi";

export class GraphicOrganizerService {
    async makeGraphicOrganizer(noteId: string): Promise<GraphicOrganizer> {
        const response = await createGraphicOrganizer(noteId);
        return response;
    }

    async obtainGraphicOrganizer(noteId: string): Promise<GraphicOrganizer> {
        const response = await getGraphicOrganizer(noteId);
        return response;
    }
}