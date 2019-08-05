import { Service } from 'typedi';
import { IUser } from '../interfaces/IUser';
import transporter from '../config/nodemailer';
import LoggerInstance from '../loaders/logger';
import { verificationEmail } from '../mail';

@Service()
export default class MailerService {
  public async SendWelcomeEmail(user: Partial<IUser>) {
    try {
      const message = await transporter.sendMail({
        from: '"My Study Planner" <mystudyplanner.noreply@gmail.com>',
        to: user.email,
        subject: 'Welcome to My Study Planner!!',
        html: verificationEmail(user),
      });

      if (!message) throw new Error("Couldn't send welcome message to user.");

      return { delivered: 1, status: 'ok' };
    } catch (e) {
      LoggerInstance.error(e);
    }
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }

    return { delivered: 1, status: 'ok' };
  }
}
