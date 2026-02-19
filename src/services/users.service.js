export class UsersService {
  constructor(repository) {
    this.repository = repository;
  }

  // =========================
  // CRUD / Queries
  // =========================
  getByEmail(email) {
    return this.repository.getByEmail(email);
  }

  getById(id) {
    return this.repository.getById(id);
  }

  getAll() {
    return this.repository.getAll();
  }

  create(data) {
    return this.repository.create(data);
  }

  update(id, data) {
    return this.repository.update(id, data);
  }

  delete(id) {
    return this.repository.delete(id);
  }

  // =========================
  // Password Reset
  // =========================
  setResetToken(email, token, expire) {
    return this.repository.setResetToken(email, token, expire);
  }

  getByResetToken(token) {
    return this.repository.getByResetToken(token);
  }
}


