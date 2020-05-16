import * as dotenv from 'dotenv'

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️")
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  redisURL: process.env.REDIS_URL,

  siteUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.DEVELOPMENT_SITE_URL
      : process.env.PRODUCTION_SITE_URL,
  serverUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.DEVELOPMENT_SERVER_URL
      : process.env.PRODUCTION_SERVER_URL,

  cookiesDomain:
    process.env.NODE_ENV === 'development'
      ? 'localhost'
      : process.env.COOKIES_DOMAIN,
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

  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  },
}
