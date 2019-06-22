import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import evaluation from './routes/evaluation';

const app = Router();
auth(app);
user(app);
evaluation(app);

export default app;
