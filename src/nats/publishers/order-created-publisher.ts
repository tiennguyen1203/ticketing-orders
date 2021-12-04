import { Publisher, Subjects, TicketCreatedEvent } from '@tnticketing/common';

export class OrderCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject = Subjects.OrderCreated;
}
