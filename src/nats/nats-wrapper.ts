import nats, { Stan } from 'node-nats-streaming';

export class NatsWrapper {
  private static _client?: Stan;

  static get client(): Stan {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  static connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to Nats!');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}
