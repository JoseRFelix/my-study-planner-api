import { Urgency } from './IUser';

export default interface IToDo {
  task: String;
  urgency: Urgency;
  done: boolean;
}
