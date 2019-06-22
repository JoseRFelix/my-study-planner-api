import { Urgency } from './IUser';

export default interface IEvaluation {
  subject: String;
  evaluationType: String;
  date: Date;
  urgency: Urgency;
  description: String;
  done: boolean;
}
