import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();
// Local Strategy
passport.use(
    new LocalStrategy(
      {
        usernameField: "phoneNumber",
        passwordField: "password",
      },
      async (phoneNumber, password, done) => {
        try {
          const user = await User.findOne({ phoneNumber });
          if (!user) {
            return done({ message: "Incorrect phone number.", status: 401 });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done({ message: "Incorrect password.", status: 401 });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };
  
  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload._id); // maybe payload.id not _id
        console.log(user)
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );

export default passport;
