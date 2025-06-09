import { Request, Response } from "express";
import { GraphicOrganizerService } from "../Application/organizer.service";

export default class GraphicOrganizerController {
  private organizerService = new GraphicOrganizerService();

  // El método de mapeo ya no es necesario aquí. ¡Lo borramos!
  // private mapOrganizerToDto(organizer: any) { ... }

  async generate(req: Request, res: Response): Promise<void> {
    try {
      const noteId = req.body.noteId as string;
      if (!noteId) {
        res.status(400).json({ message: 'noteId is required' });
        return;
      }
      
      // El servicio ahora devuelve el objeto en el formato correcto (camelCase).
      const organizer = await this.organizerService.generateOrganizer(noteId);
      
      // Simplemente lo enviamos. No se necesita transformación.
      res.status(200).json(organizer);

    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error generating graphic organizer'
      });
    }
  }

  async getByNoteId(req: Request, res: Response): Promise<void> {
    try {
      const noteId = req.params.noteId as string;
      const organizer = await this.organizerService.getOrganizerByNoteId(noteId);

      if (organizer) {
        // El objeto ya viene en camelCase desde el servicio/repositorio.
        // Lo enviamos directamente.
        res.status(200).json(organizer);
      } else {
        res.status(404).json({ message: 'Organizer not found for this note' });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Error fetching graphic organizer'
      });
    }
  }
}