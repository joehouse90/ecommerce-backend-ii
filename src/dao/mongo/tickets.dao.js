import { TicketModel } from "../../models/ticket.model.js";

export class TicketsDAO {
  create = (data) => TicketModel.create(data);
}
