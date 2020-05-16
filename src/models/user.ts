import {IUser} from '../interfaces/IUser'
import {evaluationSchema, homeworkSchema} from './subdocuments'
import * as mongoose from 'mongoose'

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,
      unique: true,
      index: true,
    },

    fcm: {
      type: Boolean,
      required: true,
      default: false,
    },

    password: String,

    googleId: String,

    picture: String,

    registrationToken: String,

    firstSignIn: {type: Boolean, default: true, required: true},

    verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    verificationToken: String,

    role: {
      type: String,
      default: 'user',
    },

    configuration: {
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
    homework: [homeworkSchema],
    evaluations: [evaluationSchema],
    toDos: [
      {
        task: {type: String, required: true},
        urgency: {
          type: String,
          required: true,
          enum: ['IMPORTANT', 'MODERATE', 'CHILL'],
        },
        done: {type: Boolean, default: false},
      },
    ],

    semesters: [
      {
        _id: {
          type: String,
          required: true,
        },
        grades: [
          {
            subject: String,
            literalGrade: String,
            grade: Number,
            credits: Number,
          },
        ],
      },
    ],
  },
  {timestamps: true},
)

export default mongoose.model<IUser & mongoose.Document>('User', User)
