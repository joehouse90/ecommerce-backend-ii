export class TicketsService {
  constructor(repository) {
    this.repository = repository;
  }

  create(data) {
    return this.repository.create(data);
  }
}
