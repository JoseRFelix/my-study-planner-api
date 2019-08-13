import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import evaluation from './routes/evaluation';
import homework from './routes/homework';
import toDo from './routes/toDo';
import notifier from './routes/notifier';
import recover from './routes/recover';
import linkAccount from './routes/linkAccount';

const app = Router();
auth(app);
user(app);
evaluation(app);
homework(app);
toDo(app);
notifier(app);
recover(app);
linkAccount(app);

export default app;
