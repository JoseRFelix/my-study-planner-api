import { Container } from 'typedi';
import NotifierService from '../services/notifier';

export default class NotifierJob {
  public async handler(job, done): Promise<void> {
    const Logger: any = Container.get('logger');
    try {
      Logger.debug('✌️ Notification Job triggered!');

      const notifierServiceInstance = Container.get(NotifierService);
      await notifierServiceInstance.MessageAll();

      done();
    } catch (e) {
      Logger.error('🔥 Error with Notification Job: %o', e);
      done(e);
    }
  }
}
