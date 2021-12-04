import { Router } from 'express';
import { cancelOrderRouter } from './delete';
import { createTicketRouter } from './new';
import { getListOrdersRouter } from './show-list';
import { getOrderDetailRouter } from './show-one';

const router = Router();

router.use([
  createTicketRouter,
  getListOrdersRouter,
  getOrderDetailRouter,
  cancelOrderRouter,
  // getOneTicketRouter,
  // updateTicketRouter,
]);

export { router as ticketsRoutes };
