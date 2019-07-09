import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import evaluation from './routes/evaluation';
import homework from './routes/homework';
import toDo from './routes/toDo';

const app = Router();
auth(app);
user(app);
evaluation(app);
homework(app);
toDo(app);

export default app;
