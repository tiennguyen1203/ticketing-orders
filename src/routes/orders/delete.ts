import {
  NotFoundError,
  OrderStatus,
  requestValidationErrorHandler,
  requireAuth,
} from '@tnticketing/common';
import { Request, Response, Router } from 'express';
import { NatsWrapper } from '../../nats/nats-wrapper';
import { OrderCancelledPublisher } from '../../nats/publishers/order-cancelled-publisher';
import { OrderRepository } from '../../repository/order-repository';
import { idParam } from '../../validators/orders';

const router = Router();
router.delete(
  '/:id/delete',
  requireAuth,
  idParam,
  requestValidationErrorHandler,
  async (req: Request, res: Response) => {
    const order = await OrderRepository.findById(req.params.id).populate(
      'ticket'
    );
    if (!order || order.userId !== req.currentUser!.id) {
      throw new NotFoundError('Order not found');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(NatsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send({});
  }
);

export { router as cancelOrderRouter };
