import "dotenv/config"; // 👈 Carga automática de variables antes de todo

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";

import { initPassport } from "./config/passport.config.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { usersRouter } from "./routes/users.router.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initPassport({ jwtSecret: process.env.JWT_SECRET });
app.use(passport.initialize());

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) =>
  res.send("Servidor funcionando correctamente 🚀")
);

// Conexión a Mongo y servidor
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

