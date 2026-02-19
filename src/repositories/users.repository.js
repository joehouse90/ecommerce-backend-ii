export class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getByEmail(email) {
    return this.dao.getByEmail(email);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  getAll() {
    return this.dao.getAll();
  }

  create(data) {
    return this.dao.create(data);
  }

  update(id, data) {
    return this.dao.update(id, data);
  }

  delete(id) {
    return this.dao.delete(id);
  }
  setResetToken(email, token, expire) {
  return this.dao.setResetToken(email, token, expire);
}

getByResetToken(token) {
  return this.dao.getByResetToken(token);
}

}
