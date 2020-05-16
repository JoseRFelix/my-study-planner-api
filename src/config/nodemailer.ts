import * as nodemailer from 'nodemailer'
import {google} from 'googleapis'
import config from '.'

const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
  config.googleClientID,
  config.googleClientSecret,
  'https://developers.google.com/oauthplayground',
)

oauth2Client.setCredentials({
  refresh_token: config.googleRefreshToken,
})

const accessToken = oauth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'mystudyplanner.noreply@gmail.com',
    clientId: config.googleClientID,
    clientSecret: config.googleClientSecret,
    refreshToken: config.googleRefreshToken,
    accessToken,
  },
} as any)

export default transporter
