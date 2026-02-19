import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.js";
import { productsService } from "../config/dependencies.js";

export const productsRouter = Router();


// GET all — público
productsRouter.get("/", async (req, res) => {
  try {
    const products = await productsService.getAll();
    res.json({ status: "success", products });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// GET by id — público
productsRouter.get("/:pid", async (req, res) => {
  try {
    const p = await productsService.getById(req.params.pid);
    if (!p) return res.status(404).json({ error: "No existe" });
    res.json({ status: "success", product: p });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


// CREATE — ADMIN
productsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async (req, res) => {
    try {
      const created = await productsService.create(req.body);
      res.status(201).json({ status: "success", product: created });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);


// UPDATE — ADMIN
productsRouter.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async (req, res) => {
    try {
      const updated = await productsService.update(req.params.pid, req.body);
      if (!updated) {
        return res.status(404).json({ status: "error", message: "No existe" });
      }
      res.json({ status: "success", product: updated });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);


// DELETE — ADMIN
productsRouter.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization(["admin"]),
  async (req, res) => {
    try {
      const deleted = await productsService.delete(req.params.pid);
      if (!deleted) {
        return res.status(404).json({ status: "error", message: "No existe" });
      }
      res.json({ status: "success", product: deleted });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

