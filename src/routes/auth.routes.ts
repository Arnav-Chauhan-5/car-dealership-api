import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'A user with this email already exists' });
      return;
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // Sign and return JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Sign and return JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
