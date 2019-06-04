import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  /**
   * Secret Password for express-sessions
   */
  sessionSecret: process.env.SESSION_SECRET,

  /**
   * Salt rounds for bcrypt
   */
  saltRounds: process.env.SALT_ROUNDS,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL,
  },

  /**
   * Agenda.js
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: process.env.AGENDA_CONCURRENCY,
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
};
