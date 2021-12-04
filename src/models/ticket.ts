import { getModelForClass, Prop } from '@typegoose/typegoose';
import { OrderRepository } from '../repository/order-repository';

export class Ticket {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 0 })
  price: number;

  async isReserved(): Promise<boolean> {
    const existingOrder = await OrderRepository.isTicketReserved(this);
    return !!existingOrder;
  }
}

export const TicketModel = getModelForClass(Ticket, {
  schemaOptions: {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
});
