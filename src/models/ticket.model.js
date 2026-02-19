import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true },
  },
  { timestamps: true }
);

export const TicketModel = mongoose.model(ticketsCollection, ticketSchema);
