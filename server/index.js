const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

const {
  findUserById,
  findUserByGoogleId,
  upsertGoogleUser,
  persistRefreshToken,
} = require('./storage');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL = 'http://localhost:3000/login/oauth2/code/google',
  FRONTEND_REDIRECT_URL = 'http://localhost:4200/auth/callback',
  JWT_SECRET = 'dev-secret-change-me',
  SESSION_SECRET = 'dev-session-secret',
  ACCESS_TOKEN_TTL = '15m',
  REFRESH_TOKEN_TTL = '7d',
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set; Google login will fail.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID || 'missing-client-id',
      clientSecret: GOOGLE_CLIENT_SECRET || 'missing-client-secret',
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        if (!email) {
          return done(new Error('Email scope is required to sign in with Google'));
        }

        const user = upsertGoogleUser({
          id: profile.id,
          email,
          photo,
          displayName: profile.displayName || email,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = findUserById(id) || null;
  done(null, user);
});

const app = express();
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

function createToken(user, options) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      provider: user.provider,
    },
    JWT_SECRET,
    options
  );
}

function redirectWithTokens(res, accessToken, refreshToken, error) {
  const url = new URL(FRONTEND_REDIRECT_URL);
  if (error) {
    url.searchParams.set('error', error);
  }
  if (accessToken) url.searchParams.set('accessToken', accessToken);
  if (refreshToken) url.searchParams.set('refreshToken', refreshToken);
  return res.redirect(url.toString());
}

app.get(
  '/oauth2/authorization/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

app.get('/login/oauth2/code/google', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      const message = err?.message || 'Google authentication failed';
      return redirectWithTokens(res, null, null, message);
    }

    const accessToken = createToken(user, { expiresIn: ACCESS_TOKEN_TTL });
    const refreshToken = createToken(user, { expiresIn: REFRESH_TOKEN_TTL });
    persistRefreshToken(user.id, refreshToken);

    return redirectWithTokens(res, accessToken, refreshToken);
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`OAuth2 server listening on http://localhost:${port}`);
});
