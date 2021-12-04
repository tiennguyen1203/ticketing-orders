import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requestValidationErrorHandler,
  requireAuth,
} from '@tnticketing/common';
import { Request, Response, Router } from 'express';
import { NatsWrapper } from '../../nats/nats-wrapper';
import { OrderCreatedPublisher } from '../../nats/publishers/order-created-publisher';
import { OrderRepository } from '../../repository/order-repository';
import { TicketRepository } from '../../repository/ticket-repository';
import { createOrderBodyValidator } from '../../validators/orders';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = Router();
router.post(
  '/new',
  requireAuth,
  createOrderBodyValidator,
  requestValidationErrorHandler,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = OrderRepository.createOrder({
      userId: req.currentUser!.id,
      expiresAt: expiration,
      ticket,
      status: OrderStatus.Created,
    });
    await order.save();

    new OrderCreatedPublisher(NatsWrapper.client).publish({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createTicketRouter };
