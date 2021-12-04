import { OrderStatus } from '@tnticketing/common';
import { getModelForClass, mongoose, Prop } from '@typegoose/typegoose';
import { Ticket } from './ticket';

export class Order {
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  })
  status: OrderStatus;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, ref: 'Ticket' })
  ticket: Ticket;
}

export const OrderModel = getModelForClass(Order, {
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
