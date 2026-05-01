import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { APP_NAME } from '@ai-chat-box/shared';
import chatRoutes from './routes/chatRoutes';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', chatRoutes);
app.use('/api/project', projectRoutes);

app.get('/', (req, res) => {
  res.json({ message: `Welcome to ${APP_NAME} API` });
});

// Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
