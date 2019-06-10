import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get('/current', (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ user: req.user }).status(200);
    } catch (e) {
      console.log('🔥 error ', e);
      return next(e);
    }
  });
};
