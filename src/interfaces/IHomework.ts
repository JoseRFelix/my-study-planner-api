import { Urgency } from './IUser';

export default interface IHomework {
  subject: String;
  dueDate: Date;
  urgency: Urgency;
  description: String;
  done: Boolean;
}
