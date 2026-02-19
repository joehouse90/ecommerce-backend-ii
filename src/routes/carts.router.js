import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.js";
import { cartsService, productsService, ticketsService } from "../config/dependencies.js";
import { v4 as uuidv4 } from "uuid";

export const cartsRouter = Router();

// CREATE CART
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await cartsService.create();
    res.status(201).json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET CART
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsService.getById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Cart no existe" });
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ADD PRODUCT — SOLO USER
cartsRouter.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["user"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const qty = Math.max(1, Number(req.body?.quantity) || 1);

      if (!pid) {
        return res.status(400).json({ status: "error", message: "pid faltante" });
      }

      const cart = await cartsService.getById(cid);
      if (!cart) return res.status(404).json({ status: "error", message: "Cart no existe" });

      // validar que el producto exista antes de agregar
      const prod = await productsService.getById(pid);
      if (!prod) return res.status(404).json({ status: "error", message: "Producto no existe" });

      // guardia contra items rotos
      cart.products = cart.products.filter(p => p.product);

      const item = cart.products.find(p => {
        if (!p.product) return false;
        const currentId = p.product?._id ? p.product._id.toString() : p.product.toString();
        return currentId === pid;
      });

      if (item) item.quantity += qty;
      else cart.products.push({ product: pid, quantity: qty });

      await cartsService.save(cart);
      res.json({ status: "success", cart });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

// PURCHASE
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorization(["user", "admin"]),
  async (req, res) => {
    try {
      const cart = await cartsService.getById(req.params.cid);
      if (!cart) return res.status(404).json({ status: "error", message: "Cart no existe" });

      // limpieza defensiva: si quedó algo roto, no rompe el purchase
      cart.products = cart.products.filter(p => p.product);

      // notProcessed con detalle
      const notProcessed = [];
      let total = 0;

      // vamos armando qué queda en carrito (solo lo NO comprado)
      const remaining = [];

      for (const item of cart.products) {
        // guardia extrema
        if (!item?.product) {
          notProcessed.push({ pid: null, reason: "Referencia null en carrito" });
          continue;
        }

        const pid = item.product?._id ? item.product._id : item.product;
        const pidStr = pid?.toString?.();

        if (!pidStr) {
          notProcessed.push({ pid: null, reason: "PID inválido" });
          continue;
        }

        const product = await productsService.getById(pidStr);

        if (!product) {
          notProcessed.push({ pid: pidStr, reason: "Producto no existe en DB" });
          remaining.push(item);
          continue;
        }

        if (product.stock >= item.quantity) {
          const newStock = product.stock - item.quantity;
          await productsService.update(product._id, { stock: newStock });

          total += product.price * item.quantity;
        } else {
          notProcessed.push({ pid: pidStr, reason: "Stock insuficiente" });
          remaining.push(item);
        }
      }

      // actualizamos carrito: quedan solo los no comprados
      cart.products = remaining;
      await cartsService.save(cart);

      // ticket (si no compró nada, devolvemos error claro)
      if (total <= 0) {
        return res.status(400).json({
          status: "error",
          message: "No se pudo comprar ningún producto (carrito vacío o sin stock).",
          notProcessed,
        });
      }

      const ticket = await ticketsService.create({
        code: uuidv4(),
        amount: total,
        purchaser: req.user.email,
      });

      res.json({ status: "success", ticket, notProcessed });
    } catch (err) {
      console.error("💥 ERROR en purchase:", err);
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);
