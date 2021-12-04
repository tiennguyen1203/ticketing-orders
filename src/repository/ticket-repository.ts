/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { mongoose } from '@typegoose/typegoose';
import { TicketModel } from '../models/ticket';

export class TicketRepository {
  static findById(id: mongoose.Types.ObjectId | string) {
    return TicketModel.findById(id);
  }
}
