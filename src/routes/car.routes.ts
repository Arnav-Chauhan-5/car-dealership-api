import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/cars — List all cars (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/cars/:id — Get single car (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid car ID' });
      return;
    }

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/cars — Add a new car (protected)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { make, model, year, price, mileage, status } = req.body;

    // Validate required fields
    if (!make || !model || year == null || price == null) {
      res.status(400).json({ error: 'make, model, year, and price are required' });
      return;
    }

    const car = await prisma.car.create({
      data: {
        make,
        model,
        year,
        price,
        mileage: mileage ?? 0,
        status: status ?? 'available',
      },
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/cars/:id — Update a car (protected)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid car ID' });
      return;
    }

    // Check if car exists
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    const car = await prisma.car.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/cars/:id — Delete a car (protected)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid car ID' });
      return;
    }

    // Check if car exists
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    await prisma.car.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

