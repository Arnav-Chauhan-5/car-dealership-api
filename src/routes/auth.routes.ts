import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/auth/register — stub (TDD Red phase)
router.post('/register', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

// POST /api/auth/login — stub (TDD Red phase)
router.post('/login', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
