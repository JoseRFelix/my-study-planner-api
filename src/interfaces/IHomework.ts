import {Urgency} from './IUser'

export default interface IHomework {
  _id: string
  subject: string
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
