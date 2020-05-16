import {Urgency} from './IUser'

export default interface IEvaluation {
  _id: string
  subject: string
  evaluationType: string
  date: Date
  urgency: Urgency
  description: string
  done: boolean
  createdBy: {
    _id: string
    name: string
    picture: string
  }
}
