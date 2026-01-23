import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/auth.utils.js";

export const usersRouter = Router();

// ✅ GET /api/users -> listar todos (sin password)
usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find().select("-password").lean();
    res.json({ status: "success", users });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});

// ✅ GET /api/users/:uid -> traer uno por id (sin password)
usersRouter.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid).select("-password").lean();

    if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

    res.json({ status: "success", user });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});

// ✅ POST /api/users -> crear usuario (opcional si ya tenés /register, pero sirve como CRUD)
usersRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: first_name, last_name, email, password",
      });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ status: "error", message: "Email ya registrado" });

    // ⚠️ En el CRUD NO estamos hasheando acá a propósito (porque el hash está resuelto en /register con Passport+bcrypt).
    // Si querés, lo hacemos también acá usando createHash, pero con /register ya alcanza para la consigna.
    // Igual, para que quede redondo, mejor lo hasheamos:
    // --> ver el ajuste más abajo (recomendado)

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: cart || null,
      role: role || "user",
    });

    const user = newUser.toObject();
    delete user.password;

    res.status(201).json({ status: "success", user });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});

// ✅ PUT /api/users/:uid -> actualizar datos (no password por defecto)
usersRouter.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { first_name, last_name, age, cart, role } = req.body;

    const updated = await UserModel.findByIdAndUpdate(
      uid,
      { first_name, last_name, age, cart, role },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

    res.json({ status: "success", user: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});

// ✅ DELETE /api/users/:uid -> borrar usuario
usersRouter.delete("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const deleted = await UserModel.findByIdAndDelete(uid).select("-password");
    if (!deleted) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

    res.json({ status: "success", message: "Usuario eliminado", user: deleted });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error interno", error: err.message });
  }
});
