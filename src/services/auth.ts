import { Service, Inject } from 'typedi';
import * as bcrypt from 'bcrypt';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import MailerService from './mailer';
import { randomBytes } from 'crypto';
import config from '../config';

@Service()
export default class AuthService {
  constructor(@Inject('userModel') private userModel, private mailer: MailerService) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser }> {
    try {
      const saltRounds = parseInt(config.saltRounds, 10);

      const hashedPassword = await bcrypt.hash(userInputDTO.password, saltRounds);

      const userRecord = await this.userModel.create({
        ...userInputDTO,
        password: hashedPassword,
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      await this.mailer.SendWelcomeEmail(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser }> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }

    const validPassword = await bcrypt.compare(password, userRecord.password);

    if (validPassword) {
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      return user;
    } else {
      throw new Error('Invalid Password');
    }
  }

  public async deserializeUser(email: string) {
    const userRecord = await this.userModel.findOne({ email });

    if (!userRecord) throw new Error('User not found');

    return userRecord;
  }
}
