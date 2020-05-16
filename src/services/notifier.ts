import {Service, Inject} from 'typedi'
import {IUser} from '../interfaces/IUser'
import admin from '../loaders/firebase'

@Service()
export default class NotifierService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger,
  ) {}

  public async registerToken(
    registrationToken: string,
    user: IUser,
  ): Promise<string> {
    try {
      const result = await this.userModel.findOneAndUpdate(
        {email: user.email},
        {registrationToken, fcm: true},
      )

      if (!result) throw new Error('Could not add registration token')

      return 'success'
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async MessageAll() {
    try {
      //User tokens with  pending homework or evaluations
      let userTokens:
        | {registrationToken?: string}[]
        | string[] = await this.userModel
        .find({
          $and: [
            {fcm: true},
            {
              $or: [
                {'evaluations.0': {$exists: true}},
                {'homework.0': {$exists: true}},
              ],
            },
          ],
        })
        .select('registrationToken -_id')

      if (!userTokens.length) return

      //Normalize array of tokens to an array of strings
      userTokens = userTokens.map(elem => elem.registrationToken)

      let response

      if (userTokens.length <= 100) {
        const message = {
          data: {
            content:
              'You have homework to be done or evaluations to study! Come back!',
          },
          tokens: userTokens as string[],
        }

        response = await admin.messaging().sendMulticast(message)
      } else {
        response = []

        //If there are more than 100 users split the array
        //into chunks and send them a hundred by a hundred
        //This is due to firebase limitation
        //Check: https://firebase.google.com/docs/cloud-messaging/send-message
        for (let i = 0; i < userTokens.length; i += 100) {
          const message = {
            data: {
              content:
                'You have homework to be done or evaluations to study! Come back!',
            },
            tokens: userTokens.slice(i, i + 100) as string[],
          }

          await response.push(admin.messaging().sendMulticast(message))
        }
      }

      if (!response) throw new Error('Could not send message to users')

      this.logger.info('Successfully sent daily notification')
    } catch (e) {
      this.logger.error(e)
      throw e
    }
  }
}
