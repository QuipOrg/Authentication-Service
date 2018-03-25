let jwt = require('jsonwebtoken');
let passport = require('passport');
let passportJWT = require("passport-jwt");
let _ = require("lodash");
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let User = require('./models/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'shhhhQuipTrollzz'
  }, (jwt_payload, done) => {
    let user = User.findOne({username: jwt_payload.username}, (err, user) => {
      if (err)
        return done(err);
      if (!user)
        return done(null, false);
      if (!user.verifyPassword(password))
        return done(null, false);
      return done(null, user);
    });
  }));

  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.findOne({username: username}, (err, user) => {
        if (err)
          return done(err);
        if (!user)
          return done(null, false);
        if (!user.verifyPassword(password))
          return done(null, false);
        return done(null, user);
      });
    }
    ));

  passport.use(new FacebookStrategy(
  {
    clientID: '213006302614509',
    clientSecret: '36b6baa3e9c86a0a27eef48798171d8a',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({facebookId: profile.id}, (err, user) => {
      cb(err, user);
    });
  })
  );

  
}