import { IUser } from '../interfaces/IUser';
import * as mongoose from 'mongoose';
import * as findOrCreate from 'mongoose-findorcreate';
import { string } from 'joi';

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

    role: {
      type: String,
      default: 'user',
    },

    evaluations: [
      {
        subject: String,
        evaluationType: String,
        date: Date,
        urgency: String,
        description: String,
        done: Boolean,
      },
    ],

    todos: [
      {
        task: String,
        urgency: String,
        done: Boolean,
      },
    ],

    homework: [
      {
        subject: String,
        dueDate: Date,
        urgency: String,
        description: String,
        done: Boolean,
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

User.plugin(findOrCreate);

export default mongoose.model<IUser & mongoose.Document>('User', User);
