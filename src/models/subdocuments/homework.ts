import {IHomework} from '../../interfaces'
import * as mongoose from 'mongoose'

const Homework = new mongoose.Schema<IHomework>({
  subject: {type: String, required: true},
  date: {type: Date, required: true},
  urgency: {
    type: String,
    required: true,
    enum: ['IMPORTANT', 'MODERATE', 'CHILL'],
  },
  description: {type: String, required: true},
  done: {type: Boolean, required: true, default: false},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export default Homework
