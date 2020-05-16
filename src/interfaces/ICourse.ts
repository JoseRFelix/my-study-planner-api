import {IEvaluation, IHomework, ISchedule, IUser} from '.'

export default interface ICourse {
  _id: string
  name: string
  schedule: ISchedule
  evaluations?: IEvaluation[]
  homework?: IHomework[]
  members: Partial<IUser>[]
  createdBy: Partial<IUser>
}
