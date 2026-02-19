export class CartsService {
  constructor(repository) {
    this.repository = repository;
  }

  create() { return this.repository.create(); }
  getById(id) { return this.repository.getById(id); }
  update(id, data) { return this.repository.update(id, data); }
  save(cart) { return this.repository.save(cart); }
}
