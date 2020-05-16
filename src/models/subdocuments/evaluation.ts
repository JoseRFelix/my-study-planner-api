import {IEvaluation} from '../../interfaces'
import * as mongoose from 'mongoose'

const Evaluation = new mongoose.Schema<IEvaluation>({
  subject: {type: String, required: true},
  evaluationType: {type: String, required: true},
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

export default Evaluation
