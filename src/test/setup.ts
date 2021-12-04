/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtService } from '@tnticketing/common/build/services/jwt';
import { mongoose } from '@typegoose/typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JWT_SECRET_KEY } from './../utils/constants';

const DEFAULT_TEST_EMAIL = 'test@test.com';
const DEFAULT_USER_ID = '61718705afe387ffe2861cdd';

type AuthParams = {
  id?: mongoose.Types.ObjectId;
  email?: string;
};
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace globalThis {
    const fakeSignin: (authParams?: AuthParams) => Promise<string[]>;
    const DEFAULT_TEST_EMAIL: string;
    const DEFAULT_USER_ID: string;
  }
}

jest.mock('../nats/nats-wrapper');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

(global as any).fakeSignin = async ({
  id = DEFAULT_USER_ID,
  email = DEFAULT_TEST_EMAIL,
} = {}) => {
  const payload = {
    id: id as unknown as string,
    email,
  };
  const token = JwtService.sign(payload, JWT_SECRET_KEY);
  const sessionData = { jwt: token };

  const base64 = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  return [`express:sess=${base64}`];
};

(global as any).DEFAULT_TEST_EMAIL = DEFAULT_TEST_EMAIL;
(global as any).DEFAULT_USER_ID = DEFAULT_USER_ID;
