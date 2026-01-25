import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware, AuthRequest } from './src/middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/protected-test', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'Backend Verification Successful!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
