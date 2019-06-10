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
        const user = await authServiceInstance.SignUp(req.body as IUserInputDTO);

        passport.authenticate('local')(req, res, () => {
          req.session.cookie.expires = false;
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
        remember: Joi.boolean().required(),
      }),
    }),
    passport.authenticate('local'),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        if (req.body.remember) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Expires in 30 days
        } else {
          req.session.cookie.expires = false;
        }

        res
          .json({ user: req.user, expiresIn: req.body.remember ? req.session.cookie.maxAge / 1000 : undefined })
          .status(200);
      } catch (e) {
        console.log('🔥 error ', e);
        return next(e);
      }
    },
  );
};
