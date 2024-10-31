const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure the Google strategy for use by Passport.
passport.use(new GoogleStrategy({
    clientID: ('109925229902-t7a38r78b4rbj0pur83scnc3guqk1b21.apps.googleusercontent.com'),
    clientSecret: ('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'),
    callbackURL: "http://localhost:5500/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    // You can save the user info to the database here
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj)
});
