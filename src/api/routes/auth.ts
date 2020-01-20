import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as passport from 'passport';
import { IUserInputDTO } from '../../interfaces/IUser';
import { celebrate, Joi } from 'celebrate';
import AuthService from '../../services/auth';
import config from '../../config';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .min(6)
          .required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const user = await authServiceInstance.SignUp(req.body as IUserInputDTO);

        passport.authenticate('local')(req, res, () => {
          req.session.cookie.expires = false;

          res.cookie('IS_LOGGED_IN', true, {
            httpOnly: false,
            domain: config.cookiesDomain,
          });

          return res.json({ user }).status(201);
        });
      } catch (e) {
        console.log('🔥 error ', e);
        return next(e);
      }
    },
  );

  route.get(
    '/verification',
    celebrate({
      query: Joi.object({
        email: Joi.string()
          .email()
          .required(),
        token: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const user = await authServiceInstance.VerifyEmail(req.query.email, req.query.token);

        res.redirect(config.siteUrl);
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
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
        remember: Joi.boolean().required(),
      }),
    }),
    passport.authenticate('local'),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        if (req.body.remember) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //Expires in 30 days
          res.cookie('IS_LOGGED_IN', true, {
            maxAge: req.session.cookie.maxAge,
            httpOnly: false,
            domain: config.cookiesDomain,
          });
        } else {
          res.cookie('IS_LOGGED_IN', true, {
            httpOnly: false,
            domain: config.cookiesDomain,
          });
          req.session.cookie.expires = false;
        }

        res.json({ user: req.user }).status(200);
      } catch (e) {
        console.log('🔥 error ', e);
        return next(e);
      }
    },
  );

  route.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

  route.get('/google/callback', passport.authenticate('google'), (req: Request, res: Response, next: NextFunction) => {
    res.cookie('IS_LOGGED_IN', true, {
      httpOnly: false,
      domain: config.cookiesDomain,
    });
    res.redirect(config.siteUrl);
  });
};
