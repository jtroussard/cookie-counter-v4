import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware, AuthRequest } from './src/middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


// Serve static files from the React client build
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

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


// Catch-all route for SPA (MUST be after API routes)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
