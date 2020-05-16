import {Router, Request, Response} from 'express'
import {isAuthorized} from '../middlewares'
import {celebrate, Joi} from 'celebrate'
import {Container} from 'typedi'
import {IUser} from '../../interfaces/IUser'
import HomeworkService from '../../services/homework'
import IHomework from '../../interfaces/IHomework'
import {homeworkDTOJoi, homeworkJoi} from '../validation'

const route = Router()

export default (app: Router) => {
  app.use('/homework', route)

  route.post(
    '/add',
    celebrate({
      body: Joi.object(homeworkDTOJoi),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const homeworkServiceInstance = Container.get(HomeworkService)
        const homework = await homeworkServiceInstance.Add(
          req.user as IUser,
          req.body as IHomework,
        )

        res.json({homework}).status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )

  route.patch(
    '/update',
    celebrate({
      body: Joi.object(homeworkJoi),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const homeworkServiceInstance = Container.get(HomeworkService)
        const homework = await homeworkServiceInstance.Update(
          req.user as IUser,
          req.body as IHomework,
        )

        res.json({homework}).status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )

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
        const homeworkServiceInstance = Container.get(HomeworkService)
        await homeworkServiceInstance.Delete(req.user._id, req.body._id)

        res.json('done').status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )
}
