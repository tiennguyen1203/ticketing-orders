import { mongoose } from '@typegoose/typegoose';
import request from 'supertest';
import { app } from '../../../app';

describe.skip('[DELETE] /api/v1/tickets/:id/delete', () => {
  describe('When user logged in', () => {
    describe('When order does not exist', () => {
      it('<404> Should throw not found error', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
          .delete(`/api/v1/tickets/${id}/delete`)
          .set('Cookie', await fakeSignin())
          .send()
          .expect(404);
      });
    });
    // describe('When existing order', () => {
    //   describe('When the order is not owned by currentUser', () => {
    //     it("<200> Should return delete success, but don't delete the order", async () => {});
    //   });
    //   describe('When the order is owned by currentUser', () => {
    //     it('<200> Should return delete success, and delete the order', async () => {});
    //   });
    // });
  });
});
