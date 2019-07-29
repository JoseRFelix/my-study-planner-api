import { Service, Inject } from 'typedi';
import * as bcrypt from 'bcrypt';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import MailerService from './mailer';
import config from '../config';
import events from '../subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private mailer: MailerService,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser }> {
    try {
      const saltRounds = parseInt(config.saltRounds, 10);

      const hashedPassword = await bcrypt.hash(userInputDTO.password, saltRounds);

      let userRecord = await this.userModel.create({
        ...userInputDTO,
        password: hashedPassword,
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser }> {
    let userRecord = await this.userModel.findOne({ email }).populate([
      {
        path: 'evaluations.createdBy',
        select: '_id name picture',
      },
      {
        path: 'homework.createdBy',
        select: '_id name picture',
      },
    ]);

    if (!userRecord) {
      const err = new Error('User not registered');
      err['status'] = 404;
      throw err;
    }

    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (validPassword) {
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      user.evaluations = await userRecord.evaluations.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      user.homework = await userRecord.homework.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return user;
    } else {
      const err = new Error('Invalid Password');
      err['status'] = 400;
      throw err;
    }
  }

  public async SignInGoogle(profile) {
    try {
      const userInfo = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.email,
        picture: profile.picture,
      };

      let userRecord = await this.userModel.findOne({ email: userInfo.email }).populate([
        {
          path: 'evaluations.createdBy',
          select: '_id name picture',
        },
        {
          path: 'homework.createdBy',
          select: '_id name picture',
        },
      ]);

      if (!userRecord) {
        userRecord = await this.userModel.create(userInfo);
      } else {
        userRecord.evaluations = await userRecord.evaluations.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        userRecord.homework = await userRecord.homework.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      }

      return userRecord;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async deserializeUser(email: string) {
    let userRecord = await this.userModel.findOne({ email }).populate([
      {
        path: 'evaluations.createdBy',
        select: '_id name picture',
      },
      {
        path: 'homework.createdBy',
        select: '_id name picture',
      },
    ]);

    if (!userRecord) throw new Error('User not found');

    userRecord.evaluations = await userRecord.evaluations.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    userRecord.homework = await userRecord.homework.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return userRecord;
  }
}
