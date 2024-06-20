const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { generateJWT } = require("./utils/jwt"); // Your JWT utility function
const User = require("./models/userModel"); // Your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async function (token, tokenSecret, profile, done) {
      try {
        // Check if the user already exists with Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // Check if a user exists with the same email
          user = await User.findOne({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            // Update user with Google ID
            user.googleId = profile.id;
          } else {
            // If the user doesn't exist, create a new user
            user = await User.create({
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
