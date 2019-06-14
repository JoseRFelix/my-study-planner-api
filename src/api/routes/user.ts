import { Router, Request, Response, NextFunction } from 'express';
import { isAuthorized } from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get('/current', isAuthorized, (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ user: req.user }).status(200);
    } catch (e) {
      console.log('🔥 error ', e);
      return next(e);
    }
  });

  route.get('/signout', isAuthorized, (req: Request, res: Response, next: NextFunction) => {
    try {
      req.logOut();
      res.json({ message: 'Successful sign out' }).status(200);
    } catch (e) {
      console.log('🔥 error ', e);
      return next(e);
    }
  });
};
