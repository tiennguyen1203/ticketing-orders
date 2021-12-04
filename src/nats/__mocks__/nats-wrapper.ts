export class NatsWrapper {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static client = {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  };
}
