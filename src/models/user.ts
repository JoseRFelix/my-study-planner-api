import { IUser } from '../interfaces/IUser';
import * as mongoose from 'mongoose';

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

    password: String,

    googleId: String,

    picture: String,

    registrationToken: String,

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

    evaluations: [
      {
        subject: String,
        evaluationType: String,
        date: Date,
        urgency: String,
        description: String,
        done: Boolean,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],

    toDos: [
      {
        task: String,
        urgency: String,
        done: Boolean,
      },
    ],

    homework: [
      {
        subject: String,
        date: Date,
        urgency: String,
        description: String,
        done: Boolean,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
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
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
