import { ProductModel } from "../../models/product.model.js";

export class ProductsDAO {
  getAll = () => ProductModel.find();

  getById = (id) => ProductModel.findById(id);

  getByCode = (code) => ProductModel.findOne({ code });

  create = (data) => ProductModel.create(data);

  update = (id, data) =>
    ProductModel.findByIdAndUpdate(id, data, { new: true });

  delete = (id) => ProductModel.findByIdAndDelete(id);
}
