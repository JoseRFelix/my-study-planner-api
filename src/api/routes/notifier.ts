import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { isAuthorized } from '../middlewares';
import NotifierService from '../../services/notifier';

const route = Router();

export default (app: Router) => {
  app.use('/notifier', route);

  route.post(
    '/add-token',
    celebrate({
      body: Joi.object({
        registrationToken: Joi.string().required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const notifier = Container.get(NotifierService);
        const result = await notifier.SubscribeUserToDailyAssignments(req.body.registrationToken as string);

        return res.status(200).json(result);
      } catch (e) {
        console.log('🔥 error ', e);
        return next(e);
      }
    },
  );
};
