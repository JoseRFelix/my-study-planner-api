import {Service, Inject} from 'typedi'
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '../decorators/eventDispatcher'
import redisClient from '../loaders/redis'
import * as bcrypt from 'bcrypt'
import {Logger} from 'winston'
import config from '../config'

@Service()
export default class RecoverService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Inject('logger') private logger: Logger,
  ) {}

  public async ConfirmResetPasswordToken(token: string): Promise<string> {
    try {
      const userEmail: string = await redisClient.getAsync(
        `rPasswordHash::${token}`,
      )

      if (!userEmail) {
        const err = new Error('Invalid credentials')
        err['status'] = 400
        throw err
      }

      return token
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }

  public async ChangePassword(
    token: string,
    password: string,
  ): Promise<string> {
    try {
      const userEmail: string = await redisClient.getAsync(
        `rPasswordHash::${token}`,
      )

      if (!userEmail) {
        const err = new Error('Invalid credentials')
        err['status'] = 400
        throw err
      }

      const saltRounds = parseInt(config.saltRounds, 10)
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const userRecord = await this.userModel.findOneAndUpdate(
        {email: userEmail},
        {$set: {password: hashedPassword}},
      )

      if (!userRecord) {
        throw new Error("Couldn't update password")
      }

      await redisClient.del(`rPasswordHash::${token}`)

      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')

      return 'success'
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
