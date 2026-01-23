import { Router } from "express";
import passport from "passport";
import { signToken } from "../utils/jwt.utils.js";

export const sessionsRouter = Router();

// REGISTER (opcional, útil para probar)
sessionsRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    const user = req.user.toObject();
    delete user.password;
    res.status(201).json({ status: "success", user });
  }
);

// LOGIN -> emite JWT (cookie httpOnly + también lo devolvemos por body)
sessionsRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    const u = req.user;
    const token = signToken(
      { uid: u._id.toString(), role: u.role, email: u.email },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES || "1d"
    );

    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // en prod: true (HTTPS)
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ status: "success", token });
  }
);

// CURRENT -> devuelve el usuario del token
sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false, failureMessage: true }),
  async (req, res) => {
    res.json({ status: "success", user: req.user });
  }
);
