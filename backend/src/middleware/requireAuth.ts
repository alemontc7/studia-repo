import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../modules/Auth/jwtService';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const header = req.cookies?.token;
    if (!header) throw new Error('Missing Authorization header');
    const token = header.replace(/^Bearer\s+/, '');
    if(!jwtService.verifyToken(token)) throw new Error('Invalid token');
    const payload = jwtService.decodeToken(token);
    console.log("THIS IS THE PAYLOAD", payload);
    (req as any).body.userId = payload.userId;
    console.log("THE USER ID AFTER DECODATION IS ", (req as any).body.userId);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authenticated' });
  }
}