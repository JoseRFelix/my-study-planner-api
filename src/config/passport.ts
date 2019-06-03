import * as passport from 'passport';
import * as pLocal from 'passport-local';

const LocalStrategy = pLocal.Strategy;

passport.use(new LocalStrategy((username: String, password: String, done) => {}));
