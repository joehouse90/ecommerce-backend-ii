import { CartModel } from "../../models/cart.model.js";

export class CartsDAO {
  create = () => CartModel.create({});

  getById = (id) =>
    CartModel.findById(id).populate("products.product");

  update = (id, data) =>
    CartModel.findByIdAndUpdate(id, data, { new: true });

  save = (cart) => cart.save();
}
