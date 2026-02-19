import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { usersService } from "./dependencies.js";

import { createHash, isValidPassword } from "../utils/auth.utils.js";

export const initPassport = ({ jwtSecret }) => {
  // REGISTER (opcional para testear rápido)
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true, session: false },
      async (req, email, password, done) => {
        try {
          const exists = await usersService.getByEmail(email);

          if (exists) return done(null, false, { message: "Email ya registrado" });

          const { first_name, last_name, age, cart } = req.body;
         const user = await usersService.create({

            first_name,
            last_name,
            age,
            cart: cart || null,
            email,
            password: createHash(password),
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
         const user = await usersService.getByEmail(email);

          if (!user) return done(null, false, { message: "Credenciales inválidas" });
          if (!isValidPassword(password, user.password))
            return done(null, false, { message: "Credenciales inválidas" });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // JWT
  const cookieExtractor = (req) =>
    req?.cookies?.jwt ? req.cookies.jwt : null;

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: jwtSecret,
      },
      async (payload, done) => {
        try {
         const user = await usersService.getById(payload.uid)

            .select("-password")
            .lean();
        if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
