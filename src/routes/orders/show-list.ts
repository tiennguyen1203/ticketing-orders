import {
  requestValidationErrorHandler,
  requireAuth,
} from '@tnticketing/common';
import { Request, Response, Router } from 'express';
import { OrderRepository } from '../../repository/order-repository';

const router = Router();
router.get(
  '/show',
  requireAuth,
  requestValidationErrorHandler,
  async (req: Request, res: Response) => {
    const orders = await OrderRepository.find(req.currentUser!.id).populate(
      'ticket'
    );

    res.status(200).send(orders);
  }
);

export { router as getListOrdersRouter };
