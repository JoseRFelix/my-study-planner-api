import { Urgency } from './IUser';

export default interface IHomework {
  _id: String;
  subject: String;
  dueDate: Date;
  urgency: Urgency;
  description: String;
  done: Boolean;
  createdBy: {
    _id: String;
    name: String;
    picture: String;
  };
}
