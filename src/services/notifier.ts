import { Service, Inject } from 'typedi';
import redisClient from '../loaders/redis';
import { IUser } from '../interfaces/IUser';
import * as redisScan from 'redisscan';
import admin from '../loaders/firebase';

@Service()
export default class NotifierService {
  constructor(@Inject('userModel') private userModel, @Inject('logger') private logger) {}

  public async SubscribeUserToDailyAssignments(registrationToken: string): Promise<string> {
    try {
      const result = await admin.messaging().subscribeToTopic(registrationToken, 'daily-assignments');

      if (!result) throw new Error('Could not add registration token');

      return 'success';
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async MessageAll() {
    try {
      /*const userRecord = this.userModel.findOne()

      evaluations.filter(
        evaluation => isThisWeek(moment(evaluation.date)) && !evaluation.done
      ).length
      homework.filter(
        currHomework =>
          isThisWeek(moment(currHomework.date)) && !currHomework.done
      ).length*/

      const message = {
        data: { score: '850', time: '2:45' },
        topic: 'daily-assignments',
      };

      const response = await admin.messaging().send(message);

      if (!response) throw new Error('Could not send message to users');

      this.logger.info('Successfully sent daily notification');
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
