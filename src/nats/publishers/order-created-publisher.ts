import { Publisher, Subjects, OrderCreatedEvent } from '@tnticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject = Subjects.OrderCreated;
}
