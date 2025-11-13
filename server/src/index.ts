import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
// Allow cross-origin requests from our frontend
app.use(
  cors({
    origin: 'http://localhost:3000', // We'll set our frontend to run on port 3000
    credentials: true,
  })
);

// Allow the server to accept JSON in the request body
app.use(express.json());

// --- Simple Test Route ---
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});