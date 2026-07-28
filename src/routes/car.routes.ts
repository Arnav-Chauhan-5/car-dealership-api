import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// GET /api/cars — List all cars (public)
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /api/cars/:id — Get single car (public)
router.get('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// POST /api/cars — Add a new car (protected)
router.post('/', authMiddleware, (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// PUT /api/cars/:id — Update a car (protected)
router.put('/:id', authMiddleware, (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// DELETE /api/cars/:id — Delete a car (protected)
router.delete('/:id', authMiddleware, (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
