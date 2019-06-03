import * as passport from 'passport';
import * as pLocal from 'passport-local';
import { Container } from 'typedi';
import AuthService from '../services/auth';
import { IUser } from '../interfaces/IUser';

const LocalStrategy = pLocal.Strategy;

passport.use(
  new LocalStrategy(async (email: string, password: string, done) => {
    try {
      const authServerInstance = Container.get(AuthService);
      const { user } = await authServerInstance.SignIn(email, password);
      done(null, user);
    } catch (e) {
      console.log('🔥 error ', e);
      done(e);
    }
  }),
);

passport.serializeUser((user: IUser, done) => done(null, user.email));

passport.deserializeUser(async (email: string, done) => {
  try {
    const authServerInstance = Container.get(AuthService);
    const { user } = await authServerInstance.deserializeUser(email);
    done(null, user);
  } catch (e) {
    console.log('🔥 error ', e);
    done(e);
  }
});
