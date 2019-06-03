import { Service } from 'typedi';
import { IUser } from '../interfaces/IUser';

@Service()
export default class MailerService {
  public SendWelcomeEmail(user: Partial<IUser>) {
    /**
     * @TODO Introduce nodemailer
     */
    return { delivered: 1, status: 'ok' };
  }
  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }

    return { delivered: 1, status: 'ok' };
  }
}
