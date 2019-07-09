import { Urgency } from './IUser';

export default interface IToDo {
  _id: string;
  task: String;
  urgency: Urgency;
  done: boolean;
}
