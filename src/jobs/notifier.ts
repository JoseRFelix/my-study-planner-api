import {Container} from 'typedi'
import NotifierService from '../services/notifier'
import {Logger as LoggerTypes} from 'winston'

export default class NotifierJob {
  public async handler(job, done): Promise<void> {
    const Logger: LoggerTypes = Container.get('logger')
    try {
      Logger.debug('✌️ Notification Job triggered!')

      //Send notification only in production.
      if (process.env.NODE_ENV === 'production') {
        const notifierServiceInstance = Container.get(NotifierService)
        await notifierServiceInstance.MessageAll()
      }

      done()
    } catch (e) {
      Logger.error('🔥 Error with Notification Job: %o', e)
      done(e)
    }
  }
}
