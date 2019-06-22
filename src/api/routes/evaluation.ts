import { Router, Request, Response } from 'express';
import { isAuthorized } from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import EvaluationService from '../../services/evaluation';
import IEvaluation from '../../interfaces/IEvaluation';

const route = Router();

export default (app: Router) => {
  app.use('/evaluation', route);

  route.post(
    '/add',
    celebrate({
      body: Joi.object({
        subject: Joi.string().required(),
        evaluation: Joi.string()
          .valid('quiz', 'test')
          .required(),
        urgency: Joi.string()
          .valid('chill', 'normal', 'important')
          .required(),
        description: Joi.string().required(),
        date: Joi.date().required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const evaluationServiceInstance = Container.get(EvaluationService);
        const user = await evaluationServiceInstance.Add(req.user._id, req.body as IEvaluation);

        res.json({ user }).status(200);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  );
};
