import {Service, Inject} from 'typedi'
import {IUser} from '../interfaces/IUser'
import transporter from '../config/nodemailer'
import {verificationEmail, recoverPasswordEmail} from '../mail'
import {Logger} from 'winston'
import cryptoRandomString = require('crypto-random-string')
import redisClient from '../loaders/redis'

@Service()
export default class MailerService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger,
  ) {}

  public async SendWelcomeEmail(user: Partial<IUser>) {
    try {
      const messageStatus = await transporter.sendMail({
        from: '"My Study Planner" <mystudyplanner.noreply@gmail.com>',
        to: user.email,
        subject: 'Welcome to My Study Planner!!',
        html: verificationEmail(user),
      })

      if (!messageStatus)
        throw new Error("Couldn't send welcome message to user.")

      return {delivered: 1, status: 'ok'}
    } catch (e) {
      this.logger.error(e)
    }
  }

  public async SendRecoveryPasswordEmail(email: string) {
    try {
      const userRecord = await this.userModel.findOne({email})

      if (!userRecord) {
        const err = new Error('Invalid email')
        err['status'] = 400
        throw err
      }

      if (userRecord.googleId) {
        return {google: true}
      }

      //Generate token for password reset
      const token = cryptoRandomString({length: 32})

      const HASH_EXPIRATION_TIME = 14400 //4 hours

      //Set token in Redis to expire in 4 hours
      const redisResponse = await redisClient.set(
        `rPasswordHash::${token}`,
        userRecord.email,
        'EX',
        HASH_EXPIRATION_TIME,
      )

      if (!redisResponse) {
        throw new Error('Failed to add hash to Redis')
      }

      //Send email to user
      const messageStatus = await transporter.sendMail({
        from: '"My Study Planner" <mystudyplanner.noreply@gmail.com>',
        to: userRecord.email,
        subject: 'My Study Planner recover password link',
        html: recoverPasswordEmail(userRecord.name, token, userRecord.email),
      })

      if (!messageStatus)
        throw new Error("Couldn't send welcome message to user.")

      return {delivered: 1, status: 'ok'}
    } catch (e) {
      this.logger.error(e)
    }
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided')
    }

    return {delivered: 1, status: 'ok'}
  }
}
