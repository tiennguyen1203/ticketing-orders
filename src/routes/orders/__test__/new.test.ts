import { OrderStatus } from '@tnticketing/common';
import { mongoose } from '@typegoose/typegoose';
import request from 'supertest';
import { app } from '../../../app';
import { OrderModel } from '../../../models/order';
import { TicketModel } from '../../../models/ticket';
import { NatsWrapper } from '../../../nats/nats-wrapper';

describe('[POST] /api/v1/orders/new', () => {
  describe('When user logged in', () => {
    describe('When body is valid', () => {
      describe('When ticket does not exist', () => {
        it('<404> Should throw not found error', async () => {
          const cookie = await fakeSignin();
          await request(app)
            .post('/api/v1/orders/new')
            .set('Cookie', cookie)
            .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
            .expect(404);
        });
      });

      describe('When existing ticket', () => {
        describe('When ticket is reserved', () => {
          it('<400> Should throw bad request error', async () => {
            // Arrange
            const cookie = await fakeSignin();
            const ticket = new TicketModel({
              id: new mongoose.Types.ObjectId().toHexString(),
              title: 'concert',
              price: 20,
            });
            await ticket.save();

            const order = new OrderModel({
              ticket,
              userId: 'asdf',
              status: OrderStatus.Created,
              expiresAt: new Date(),
            });
            await order.save();

            // Act & Assert
            await request(app)
              .post('/api/v1/orders/new')
              .set('Cookie', cookie)
              .send({ ticketId: ticket.id })
              .expect(400);
          });
        });

        describe('When ticket have not reserved', () => {
          it('<201> Should return created order, and publish order:created event', async () => {
            const ticket = new TicketModel({
              title: 'concert',
              price: 20,
            });
            await ticket.save();
            const response = await request(app)
              .post('/api/v1/orders/new')
              .set('Cookie', await fakeSignin())
              .send({
                ticketId: ticket.id,
              })
              .expect(201);

            expect(NatsWrapper.client.publish).toHaveBeenCalledTimes(1);
            expect(response.body.ticket.id).toEqual(ticket.id);
            expect(response.body.id).toBeDefined();
          });
        });
      });
    });

    describe('When body is invalid', () => {
      it('<400> Should throw Bad Request error', async () => {
        await request(app)
          .post('/api/v1/orders/new')
          .set('Cookie', await fakeSignin())
          .send({
            ticketId: 'invalidId',
          })
          .expect(400);
      });
    });
  });

  describe('When user not logged in', () => {
    it('<401> Should throw Unauthorized error', async () => {
      await request(app)
        .post('/api/v1/orders/new')
        .send({
          title: 'Title',
          price: 50,
        })
        .expect(401);
    });
  });
});
