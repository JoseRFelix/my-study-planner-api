import {Router, Request, Response} from 'express'
import {isAuthorized} from '../middlewares'
import {celebrate, Joi} from 'celebrate'
import {Container} from 'typedi'
import EvaluationService from '../../services/evaluation'
import IEvaluation from '../../interfaces/IEvaluation'
import {IUser} from '../../interfaces/IUser'
import {evaluationDTOJoi, evaluationJoi} from '../validation'

const route = Router()

export default (app: Router) => {
  app.use('/evaluation', route)

  route.post(
    '/add',
    celebrate({
      body: Joi.object(evaluationDTOJoi),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const evaluationServiceInstance = Container.get(EvaluationService)
        const evaluation = await evaluationServiceInstance.Add(
          req.user as IUser,
          req.body as IEvaluation,
        )

        res.json({evaluation}).status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )

  route.patch(
    '/update',
    celebrate({
      body: Joi.object(evaluationJoi),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const evaluationServiceInstance = Container.get(EvaluationService)
        const evaluation = await evaluationServiceInstance.Update(
          req.user as IUser,
          req.body as IEvaluation,
        )

        res.json({evaluation}).status(200)
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
        const evaluationServiceInstance = Container.get(EvaluationService)

        await evaluationServiceInstance.Delete(req.user._id, req.body._id)

        res.json('done').status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )
}
