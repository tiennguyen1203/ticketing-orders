import { Router } from 'express';
import { createTicketRouter } from './new';
import { getListOrdersRouter } from './show-list';
import { getOrderDetailRouter } from './show-one';

const router = Router();

router.use([
  createTicketRouter,
  getListOrdersRouter,
  getOrderDetailRouter,
  // getOneTicketRouter,
  // updateTicketRouter,
]);

export { router as ticketsRoutes };
