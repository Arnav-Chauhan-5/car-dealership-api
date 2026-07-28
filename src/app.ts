import express from 'express';
import authRoutes from './routes/auth.routes';
import carRoutes from './routes/car.routes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

export default app;
