const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { User } = require("../user/models/user");
require("dotenv").config();
const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
module.exports = (passport) => {
  passport.use(
    new JWTStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.find({ email: jwt_payload.email})
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    })
  );
};
