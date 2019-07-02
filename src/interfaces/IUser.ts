import IEvaluation from './IEvaluation';
import IToDo from './IToDo';
import IHomework from './IHomework';
import IUserConfig from './IUserConfig';

export enum Urgency {
  important = 'IMPORTANT',
  moderate = 'MODERATE',
  chill = 'CHILL',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  picture?: string;
  password?: string;
  googleId?: string;
  configuration: IUserConfig;
  evaluations?: IEvaluation[];
  todos?: IToDo[];
  homework?: IHomework[];
  semesters?: { _id: String; grades: { subject: String; literalGrade: String; grade: number; credits: number }[] }[];
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}
