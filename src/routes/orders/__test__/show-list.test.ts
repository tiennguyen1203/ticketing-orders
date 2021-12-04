import { mongoose } from '@typegoose/typegoose';
import request from 'supertest';
import { app } from '../../../app';
import { TicketModel } from '../../../models/ticket';

const generateTicket = () =>
  TicketModel.create({
    title: 'concert',
    price: 20,
  });

describe('[GET] /api/v1/orders/show', () => {
  describe('when user logged in', () => {
    it('<200> Should return only list orders which are owned by currentUser', async () => {
      const ticket1 = await generateTicket();
      const ticket2 = await generateTicket();
      const ticket3 = await generateTicket();

      const user1 = await fakeSignin({
        id: new mongoose.Types.ObjectId(),
      });
      const user2 = await fakeSignin({
        id: new mongoose.Types.ObjectId(),
      });

      // Create order for user1
      await request(app)
        .post('/api/v1/orders/new')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201);

      // Create order for user2
      const { body: order2 } = await request(app)
        .post('/api/v1/orders/new')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);
      const { body: order3 } = await request(app)
        .post('/api/v1/orders/new')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201);

      // Get orders for user2
      const { body: orders } = await request(app)
        .get(`/api/v1/orders/show`)
        .set('Cookie', user2)
        .expect(200);

      expect(orders.length).toEqual(2);
      expect(orders[0].id).toEqual(order2.id);
      expect(orders[1].id).toEqual(order3.id);
      expect(orders[0].ticket.id).toEqual(ticket2.id);
      expect(orders[1].ticket.id).toEqual(ticket3.id);
    });
  });
});
