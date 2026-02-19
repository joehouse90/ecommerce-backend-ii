export class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create() { return this.dao.create(); }
  getById(id) { return this.dao.getById(id); }
  update(id, data) { return this.dao.update(id, data); }
  save(cart) { return this.dao.save(cart); }
}
