import {
  NotFoundError,
  requestValidationErrorHandler,
  requireAuth,
} from '@tnticketing/common';
import { Request, Response, Router } from 'express';
import { OrderRepository } from '../../repository/order-repository';
import { idParam } from '../../validators/orders';

const router = Router();
router.get(
  '/:id/show',
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

    res.status(200).send(order);
  }
);

export { router as getOrderDetailRouter };
