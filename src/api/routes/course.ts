import { Router, Request, Response } from 'express';
import { isAuthorized } from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import CourseService from '../../services/course';
import { IUser } from '../../interfaces/IUser';
import { ICourse } from '../../interfaces';
import { homeworkJoi, evaluationJoi } from '../validation';

const route = Router();

export default (app: Router) => {
  app.use('/course', route);

  route.get('/', isAuthorized, async (req: Request, res: Response) => {
    try {
      const courseServiceInstance = Container.get(CourseService);
      const course = await courseServiceInstance.get(req.user as IUser);

      res.json({ course }).status(200);
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  route.get(
    '/:id',
    celebrate({
      query: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.query;
        const courseServiceInstance = Container.get(CourseService);
        const course = await courseServiceInstance.getById(id);

        res.json({ course }).status(200);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  );

  route.post(
    '/add',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        schedule: Joi.object()
          .pattern(
            /MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY/,
            Joi.object().keys({
              start: Joi.number().required(),
              end: Joi.number().required(),
              classroom: Joi.string().required(),
            }),
          )
          .required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const courseServiceInstance = Container.get(CourseService);
        const course = await courseServiceInstance.Add(req.user as IUser, req.body as ICourse);

        res.json({ course }).status(200);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  );

  route.patch(
    '/update',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        schedule: Joi.object()
          .pattern(
            /MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY/,
            Joi.object().keys({
              start: Joi.number().required(),
              end: Joi.number().required(),
              classroom: Joi.string().required(),
            }),
          )
          .required(),
        homework: Joi.array()
          .items(Joi.object(homeworkJoi))
          .required(),
        evaluations: Joi.array()
          .items(Joi.object(evaluationJoi))
          .required(),
        members: Joi.array().items(Joi.string()),
        createdBy: Joi.string(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const courseServiceInstance = Container.get(CourseService);
        const course = await courseServiceInstance.Update(req.user as IUser, req.body as ICourse);

        res.json({ course }).status(200);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  );

  route.delete(
    '/delete',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const courseServiceInstance = Container.get(CourseService);
        await courseServiceInstance.Delete(req.user._id, req.body._id);

        res.json('done').status(200);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  );
};
