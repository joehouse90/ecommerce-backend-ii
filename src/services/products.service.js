export class ProductsService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() { return this.repository.getAll(); }
  getById(id) { return this.repository.getById(id); }
  getByCode(code) { return this.repository.getByCode(code); }
  create(data) { return this.repository.create(data); }
  update(id, data) { return this.repository.update(id, data); }
  delete(id) { return this.repository.delete(id); }
}
