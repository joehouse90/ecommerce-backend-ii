import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { signToken } from "../utils/jwt.utils.js";
import { sendResetMail } from "../services/mail.service.js";
import { usersService } from "../config/dependencies.js";
import { createHash, isValidPassword } from "../utils/auth.utils.js";
import { UserDTO } from "../dto/user.dto.js";


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
        secure: false, // prod: true (HTTPS)
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ status: "success", token });
  }
);

// CURRENT -> devuelve DTO (no sensible)
sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json({ status: "success", user: new UserDTO(req.user) });
  }
);

// FORGOT PASSWORD -> envía mail con link (expira 1h)
sessionsRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // No revelar si existe o no
    const user = await usersService.getByEmail(email);
    if (!user) return res.json({ status: "ok", message: "Si existe, se envió un mail" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const expire = new Date(Date.now() + 60 * 60 * 1000);

    await usersService.setResetToken(email, token, expire);

    const link = `http://localhost:${process.env.PORT || 8080}/reset-password?token=${token}`;
    await sendResetMail(email, link);

    res.json({ status: "success", message: "Mail enviado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});

// RESET PASSWORD -> valida token + expira + no repetir pass
sessionsRouter.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ status: "error", message: "Faltan token o newPassword" });
    }

    const user = await usersService.getByResetToken(token);
    if (!user) return res.status(400).json({ status: "error", message: "Token inválido" });

    if (!user.resetTokenExpire || user.resetTokenExpire < new Date()) {
      return res.status(400).json({ status: "error", message: "Token expirado" });
    }

    if (isValidPassword(newPassword, user.password)) {
      return res
        .status(400)
        .json({ status: "error", message: "No puede ser la misma contraseña anterior" });
    }

    user.password = createHash(newPassword);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ status: "success", message: "Contraseña actualizada" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});
