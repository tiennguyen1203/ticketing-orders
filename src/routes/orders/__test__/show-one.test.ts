import { mongoose } from '@typegoose/typegoose';
import request from 'supertest';
import { app } from '../../../app';
import { TicketModel } from '../../../models/ticket';

const generateTicket = () =>
  TicketModel.create({
    title: 'concert',
    price: 20,
  });

describe('[GET] /api/v1/orders/:id/show', () => {
  describe('when user logged in', () => {
    it('<200> Should return only the order is owned by currentUser', async () => {
      const ticket1 = await generateTicket();
      const ticket2 = await generateTicket();

      const user1 = await fakeSignin({
        id: new mongoose.Types.ObjectId(),
      });
      const user2 = await fakeSignin({
        id: new mongoose.Types.ObjectId(),
      });

      // Create order for user1
      const { body: order1 } = await request(app)
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

      // Get orders for user2
      await request(app)
        .get(`/api/v1/orders/${order1.id}/show`)
        .set('Cookie', user2)
        .expect(404);

      const response = await request(app)
        .get(`/api/v1/orders/${order2.id}/show`)
        .set('Cookie', user2)
        .expect(200);
      expect(response.body.id).toEqual(order2.id);
      expect(response.body.ticket.id).toEqual(ticket2.id);
    });
  });
});
