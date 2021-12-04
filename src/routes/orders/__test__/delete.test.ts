import { OrderStatus } from '@tnticketing/common';
import { mongoose } from '@typegoose/typegoose';
import request from 'supertest';
import { app } from '../../../app';
import { TicketModel } from '../../../models/ticket';
import { NatsWrapper } from '../../../nats/nats-wrapper';
import { OrderRepository } from '../../../repository/order-repository';

const generateTicket = () =>
  TicketModel.create({
    title: 'concert',
    price: 20,
  });

describe('[DELETE] /api/v1/tickets/:id/delete', () => {
  describe('When user logged in', () => {
    describe('When order does not exist', () => {
      it('<404> Should throw not found error', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
          .delete(`/api/v1/orders/${id}/delete`)
          .set('Cookie', await fakeSignin())
          .send()
          .expect(404);
      });
    });
    describe('When existing order', () => {
      describe('When the order is not owned by currentUser', () => {
        it('<404> Should throw not found error', async () => {
          const ticket1 = await generateTicket();

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

          await request(app)
            .delete(`/api/v1/orders/${order1.id}/delete`)
            .set('Cookie', user2)
            .send({ ticketId: ticket1.id })
            .expect(404);
        });
      });
      describe('When the order is owned by currentUser', () => {
        it('<204> Should return success, update order status to cancelled and publish order:cancelled event', async () => {
          // Arrange
          const ticket = await generateTicket();
          const user = await fakeSignin({
            id: new mongoose.Types.ObjectId(),
          });

          // Create order for user
          const { body: order } = await request(app)
            .post('/api/v1/orders/new')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

          expect(NatsWrapper.client.publish).toHaveBeenCalledTimes(1);
          // Act
          await request(app)
            .delete(`/api/v1/orders/${order.id}/delete`)
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(204);

          // Assert
          const updatedOrder = await OrderRepository.findById(order.id);
          expect(NatsWrapper.client.publish).toHaveBeenCalledTimes(2);
          expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
        });
      });
    });
  });
});
