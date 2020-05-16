import {Service, Inject} from 'typedi'
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '../decorators/eventDispatcher'
import redisClient from '../loaders/redis'
import {Logger} from 'winston'

@Service()
export default class LinkAccountService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Inject('logger') private logger: Logger,
  ) {}

  public async ConfirmGoogleToken(token: string): Promise<string> {
    try {
      const userId: string = await redisClient.getAsync(
        `gLinkAccountToken::${token}`,
      )

      if (!userId) {
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

  public async LinkGoogleAccount(
    token: string,
    email: string,
  ): Promise<string> {
    try {
      const userId: string = await redisClient.getAsync(
        `gLinkAccountToken::${token}`,
      )

      if (!userId) {
        const err = new Error('Invalid credentials')
        err['status'] = 400
        throw err
      }

      const userRecord = await this.userModel.findOneAndUpdate(
        {email},
        {$set: {googleId: userId, password: '', verified: true}},
      )

      if (!userRecord) {
        throw new Error("Couldn't link account")
      }

      await redisClient.del(`gLinkAccountToken::${token}`)

      return 'success'
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
