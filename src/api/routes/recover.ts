import {Router, Request, Response, NextFunction} from 'express'
import {Container} from 'typedi'
import {celebrate, Joi} from 'celebrate'
import MailerService from '../../services/mailer'
import RecoverService from '../../services/recover'
import LoggerInstance from '../../loaders/logger'

const route = Router()

export default (app: Router) => {
  app.use('/recover', route)

  route.post(
    '/change_password',
    celebrate({
      body: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const recoverServiceInstance = Container.get(RecoverService)
        await recoverServiceInstance.ChangePassword(
          req.body.token,
          req.body.password,
        )

        res.status(200).json('Success')
      } catch (e) {
        LoggerInstance.log('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.post(
    '/password_token_confirmation',
    celebrate({
      body: Joi.object({
        token: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const recoverServiceInstance = Container.get(RecoverService)
        const response = await recoverServiceInstance.ConfirmResetPasswordToken(
          req.body.token,
        )

        if (!response) {
          res.status(404).json('Invalid token')
        } else {
          res.status(200).json('')
        }
      } catch (e) {
        LoggerInstance.log('🔥 error ', e)
        return next(e)
      }
    },
  )

  route.post(
    '/password',
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const mailerInstance = Container.get(MailerService)
        const mailStatus = await mailerInstance.SendRecoveryPasswordEmail(
          req.body.email,
        )

        if (!mailStatus) {
          res.status(500).json('Error sending email')
        } else if (mailStatus.google) {
          res.status(400).json('Google accounts can not restore password.')
        } else {
          res.status(200).json('Successfully sent')
        }
      } catch (e) {
        LoggerInstance.log('🔥 error ', e)
        return next(e)
      }
    },
  )
}
