import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import evaluation from './routes/evaluation';
import homework from './routes/homework';

const app = Router();
auth(app);
user(app);
evaluation(app);
homework(app);

export default app;
