import {Container} from 'typedi'
import {EventSubscriber, On} from 'event-dispatch'
import events from './events'
import {IUser} from '../interfaces/IUser'
import * as mongoose from 'mongoose'
import MailerService from '../services/mailer'
import LoggerInstance from '../loaders/logger'

@EventSubscriber()
export default class UserSubscriber {
  /**
   * A great example of an event that you want to handle
   * save the last time a user signin, your boss will be pleased.
   *
   * Altough it works in this tiny toy API, please don't do this for a production product
   * just spamming insert/update to mongo will kill it eventualy
   *
   * Use another approach like emit events to a queue (rabbitmq/aws sqs),
   * then save the latest in Redis/Memcache or something similar
   */
  @On(events.user.signIn)
  public onUserSignIn({_id}: Partial<IUser>) {
    try {
      const UserModel = Container.get('UserModel') as mongoose.Model<
        IUser & mongoose.Document
      >
      UserModel.update({_id}, {$set: {lastLogin: new Date()}})
    } catch (e) {
      console.log(`🔥 Error on event ${events.user.signIn}`)
      console.log(e)

      throw e
    }
  }
  @On(events.user.signUp)
  public async onUserSignUp(user: Partial<IUser>) {
    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your investor knows that there is a new signup
      // and leave you alone for another hour.
      // TrackerService.track('user.signup', { email, _id })
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })
      const mailerInstance = Container.get(MailerService)

      const result = await mailerInstance.SendWelcomeEmail(user)

      if (!result) throw new Error('Could not get result from service')
    } catch (e) {
      LoggerInstance.error(`🔥 Error on event ${events.user.signUp}`)
      LoggerInstance.error(e)

      // Throw the error so the process dies (check src/app.ts)
      throw e
    }
  }
}
