/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { OrderStatus } from '@tnticketing/common';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';
import { Order, OrderModel } from '../models/order';
import { Ticket } from '../models/ticket';

export class OrderRepository {
  static findByTicket(ticket: Ticket) {
    return OrderModel.findOne({ ticket });
  }

  static async isTicketReserved(ticket: Ticket) {
    const existingOrder = await this.findByTicket(ticket).findOne({
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Completed,
        ],
      },
    });

    return !!existingOrder;
  }

  static createOrder(order: Order) {
    return new OrderModel(order);
  }

  static find(userId?: string) {
    const filter: FilterQuery<DocumentType<Order, BeAnObject>> = {};
    if (userId) {
      filter.userId = userId;
    }

    return OrderModel.find(filter);
  }
}
