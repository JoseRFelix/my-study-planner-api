import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as passport from 'passport';
import { IUserInputDTO } from '../../interfaces/IUser';
import { celebrate, Joi } from 'celebrate';
import AuthService from '../../services/auth';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user } = await authServiceInstance.SignUp(req.body as IUserInputDTO);

        passport.authenticate('local')(req, res, () => {
          return res.json({ user }).status(201);
        });
      } catch (e) {
        console.log('🔥 error ', e);
        return next(e);
      }
    },
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    passport.authenticate('local'),
    (req: Request, res: Response) => {
      res.json({ user: req.user }).status(200);
    },
  );
};
