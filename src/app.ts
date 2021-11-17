import { currentUser, errorHandler, NotFoundError } from '@tnticketing/common';
import cookieSession from 'cookie-session';
import express, { json } from 'express';
import 'express-async-errors';
import { ticketsRoutes } from './routes/tickets';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use('/api/v1/tickets', ticketsRoutes);

app.all('*', async () => {
  throw new NotFoundError('Not found');
});

app.use(errorHandler);

export { app };
