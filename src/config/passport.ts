import * as passport from 'passport'
import * as pLocal from 'passport-local'
import * as pGoogle from 'passport-google-oauth2'
import {Container} from 'typedi'
import AuthService from '../services/auth'
import {IUser} from '../interfaces/IUser'
import config from '.'

const LocalStrategy = pLocal.Strategy
const GoogleStrategy = pGoogle.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackUrl,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const authServerInstance = Container.get(AuthService)
        const user = await authServerInstance.SignInGoogle(profile)

        if (typeof user === 'string') {
          const token = user
          return request.res.redirect(
            `${config.siteUrl}/link/google/${token}/${profile.email}`,
          )
        }

        done(null, user)
      } catch (e) {
        console.log('🔥 error ', e)
        done(e)
      }
    },
  ),
)

passport.use(
  new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    async (email: string, password: string, done) => {
      try {
        const authServerInstance = Container.get(AuthService)
        const user = await authServerInstance.SignIn(email, password)
        done(null, user)
      } catch (e) {
        console.log('🔥 error ', e)
        done(e)
      }
    },
  ),
)

passport.serializeUser((user: IUser, done) => done(null, user.email))

passport.deserializeUser(async (email: string, done) => {
  try {
    const authServerInstance = Container.get(AuthService)
    const user = await authServerInstance.deserializeUser(email)
    done(null, user)
  } catch (e) {
    console.log('🔥 error ', e)
    done(e)
  }
})
