import {ICourse} from '../interfaces'
import {evaluationSchema, homeworkSchema} from './subdocuments'
import * as mongoose from 'mongoose'

const Course = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a course name'],
      index: true,
    },
    schedule: {
      type: Map,
      of: {
        start: Number,
        end: Number,
        classroom: String,
      },
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    homework: [homeworkSchema],
    evaluations: [evaluationSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true},
)

export default mongoose.model<ICourse & mongoose.Document>('Course', Course)
