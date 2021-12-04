import { Router } from 'express';
import { createTicketRouter } from './new';
import { getListOrdersRouter } from './show-list';

const router = Router();

router.use([
  createTicketRouter,
  getListOrdersRouter,
  // getOneTicketRouter,
  // updateTicketRouter,
]);

export { router as ticketsRoutes };
