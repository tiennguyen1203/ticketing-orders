import mongoose from 'mongoose';
import { app } from './app';
import { NatsWrapper } from './nats/nats-wrapper';
import {
  MONGO_URI,
  NATS_CLUSTER_ID,
  NATS_CLIENT_ID,
  NATS_URL,
} from './utils/constants';
const start = async () => {
  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(MONGO_URI!);
    console.log('Connected to MongoDB!');

    await NatsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    NatsWrapper.client.on('close', () => {
      console.log('Nats connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => NatsWrapper.client.close());
    process.on('SIGTERM', () => NatsWrapper.client.close());
  } catch (error) {
    console.error('Try to connect to mongodb failed:', error);
  }

  app.listen(3000, () => console.log(`Listening on PORT 3000`));
};

start();
