const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User, userSchema } = require('../models/user');

// Configure Passport Authentication
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  

module.exports = passport;
