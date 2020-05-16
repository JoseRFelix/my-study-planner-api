import {Router, Request, Response} from 'express'
import {isAuthorized} from '../middlewares'
import {celebrate, Joi} from 'celebrate'
import {Container} from 'typedi'
import {IUser} from '../../interfaces/IUser'
import ToDoService from '../../services/toDo'
import IToDo from '../../interfaces/IToDo'

const route = Router()

export default (app: Router) => {
  app.use('/to-do', route)

  route.post(
    '/add',
    celebrate({
      body: Joi.object({
        task: Joi.string().required(),
        urgency: Joi.string().valid('chill', 'normal', 'important').required(),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const toDoServiceInstance = Container.get(ToDoService)
        const toDo = await toDoServiceInstance.Add(
          req.user as IUser,
          req.body as IToDo,
        )

        res.json({toDo}).status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )

  route.patch(
    '/update',
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        task: Joi.string().required(),
        urgency: Joi.string().valid('chill', 'normal', 'important').required(),
        done: Joi.boolean().default(false),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response) => {
      try {
        const toDoServiceInstance = Container.get(ToDoService)
        const toDo = await toDoServiceInstance.Update(
          req.user as IUser,
          req.body as IToDo,
        )

        res.json({toDo}).status(200)
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
        const toDoServiceInstance = Container.get(ToDoService)
        await toDoServiceInstance.Delete(req.user._id, req.body._id)

        res.json('done').status(200)
      } catch (e) {
        console.log(e)
        throw e
      }
    },
  )
}
