import { Router } from 'express';
import auth from './routes/auth';

const app = Router();
auth(app);

export default app;
