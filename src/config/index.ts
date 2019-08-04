import * as dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = process.env.NODE_ENV === 'development' ? dotenv.config({ path: '.env.development' }) : dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  redisURL: process.env.REDIS_URI,

  siteUrl: process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SITE_URL : process.env.PRODUCTION_SITE_URL,
  serverUrl:
    process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SERVER_URL : process.env.PRODUCTION_SERVER_URL,

  /**
   * Nodemailer
   */
  nodemailer: {
    username: process.env.NODEMAILER_USERNAME,
    password: process.env.NODEMAILER_PASSWORD,
  },

  /**
   * Secret Password for express-sessions
   */
  sessionSecret: process.env.SESSION_SECRET,

  /**
   *  Google OAUTH credentials
   */
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,

  /**
   * Cloudinary credentials
   */
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

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
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
};
