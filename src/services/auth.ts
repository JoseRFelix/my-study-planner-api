import {Service, Inject} from 'typedi'
import * as bcrypt from 'bcrypt'
import {IUser, IUserInputDTO} from '../interfaces/IUser'
import * as cryptoRandomString from 'crypto-random-string'
import config from '../config'
import events from '../subscribers/events'
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '../decorators/eventDispatcher'
import redisClient from '../loaders/redis'

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{user: IUser}> {
    try {
      const saltRounds = parseInt(config.saltRounds, 10)

      const hashedPassword = await bcrypt.hash(
        userInputDTO.password,
        saltRounds,
      )
      const verificationToken = cryptoRandomString({length: 32})

      const userRecord = await this.userModel.create({
        ...userInputDTO,
        password: hashedPassword,
        verificationToken,
      })

      if (!userRecord) {
        throw new Error('User cannot be created')
      }

      this.eventDispatcher.dispatch(events.user.signUp, userRecord)

      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')

      return user
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async VerifyEmail(
    email: string,
    token: string,
  ): Promise<{user: IUser}> {
    try {
      const userRecord = await this.userModel.findOneAndUpdate(
        {email, verificationToken: token},
        {$set: {verified: true}},
      )

      if (!userRecord) {
        const err = new Error('Invalid token')
        err['status'] = 400
        throw err
      }

      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')

      return user
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async SignIn(email: string, password: string): Promise<{user: IUser}> {
    const userRecord = await this.userModel.findOne({email}).populate([
      {
        path: 'evaluations.createdBy',
        select: '_id name picture',
      },
      {
        path: 'homework.createdBy',
        select: '_id name picture',
      },
    ])

    if (!userRecord) {
      const err = new Error('User not registered')
      err['status'] = 404
      throw err
    }

    const validPassword = await bcrypt.compare(password, userRecord.password)

    if (validPassword) {
      const user = userRecord.toObject()
      Reflect.deleteProperty(user, 'password')

      user.evaluations = userRecord.evaluations.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )

      user.homework = userRecord.homework.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )

      return user
    } else {
      const err = new Error('Invalid Password')
      err['status'] = 400
      throw err
    }
  }

  public async SignInGoogle(profile): Promise<IUser | string> {
    try {
      let userRecord = await this.userModel
        .findOne({email: profile.email})
        .populate([
          {
            path: 'evaluations.createdBy',
            select: '_id name picture',
          },
          {
            path: 'homework.createdBy',
            select: '_id name picture',
          },
        ])

      if (!userRecord) {
        const userInfo = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.email,
          picture: profile.picture,
          verified: true,
        }

        userRecord = await this.userModel.create(userInfo)
      } else if (!userRecord.googleId) {
        const token = cryptoRandomString({length: 16})

        const TOKEN_EXPIRATION_TIME = 1800 //30 minutes;

        redisClient.set(
          `gLinkAccountToken::${token}`,
          profile.id,
          'EX',
          TOKEN_EXPIRATION_TIME,
        )

        return token
      } else {
        userRecord.evaluations = await userRecord.evaluations.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

        userRecord.homework = await userRecord.homework.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
      }

      return userRecord
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async deserializeUser(email: string) {
    const userRecord = await this.userModel.findOne({email}).populate([
      {
        path: 'evaluations.createdBy',
        select: '_id name picture',
      },
      {
        path: 'homework.createdBy',
        select: '_id name picture',
      },
    ])

    if (!userRecord) throw new Error('User not found')

    userRecord.evaluations = userRecord.evaluations.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    userRecord.homework = userRecord.homework.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return userRecord
  }
}
