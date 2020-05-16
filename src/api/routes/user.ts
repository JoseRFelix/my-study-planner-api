import {Router, Request, Response, NextFunction} from 'express'
import {isAuthorized} from '../middlewares'
import Container from 'typedi'
import UserService from '../../services/user'
import uploadProfilePictureLimiter from '../middlewares/uploadProfilePictureLimiter'
import IUserConfig from '../../interfaces/IUserConfig'
import {Joi, celebrate} from 'celebrate'
import LoggerInstance from '../../loaders/logger'

const route = Router()

export default (app: Router) => {
  app.use('/user', route)

  route.get(
    '/current',
    isAuthorized,
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user.toObject()
        Reflect.deleteProperty(user, 'password')

        res.json({user: user}).status(200)
      } catch (e) {
        LoggerInstance.error('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.get(
    '/signout',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userModel: Models.UserModel = Container.get('userModel')
        const userEmail: string = req.user && req.user.toObject().email

        if (userEmail) {
          await userModel.findOneAndUpdate({email: userEmail}, {fcm: false})
        }

        req.logOut()
        res.json({message: 'Successful sign out'}).status(200)
      } catch (e) {
        LoggerInstance.error('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.post(
    '/upload_profile_picture',
    celebrate({
      body: Joi.object({
        image: Joi.string().required(),
      }),
    }),
    isAuthorized,
    uploadProfilePictureLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(UserService)
        const imageUrl = await userServiceInstance.UploadProfileImage(
          req.user,
          req.body.image as string,
        )

        res.json({imageUrl}).status(200)
      } catch (e) {
        LoggerInstance.error('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.patch(
    '/config',
    celebrate({
      body: Joi.object({
        config: Joi.object({darkMode: Joi.boolean()}),
      }),
    }),
    isAuthorized,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(UserService)
        const config = await userServiceInstance.ChangeConfig(
          req.user._id,
          req.body.config as IUserConfig,
        )

        res.json({config}).status(200)
      } catch (e) {
        LoggerInstance.error('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.post(
    '/welcome',
    isAuthorized,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userServiceInstance = Container.get(UserService)
        const response = await userServiceInstance.ChangeFirstSignin(
          req.user._id,
        )

        res.json(response).status(200)
      } catch (e) {
        LoggerInstance.error('🔥 error ', e)
        return next(e)
      }
    },
  )
}
