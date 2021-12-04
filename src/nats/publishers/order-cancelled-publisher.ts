import { Publisher, Subjects, OrderCancelledEvent } from '@tnticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject = Subjects.OrderCancelled;
}
