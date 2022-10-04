import mongoose from 'mongoose';
import * as models from './models';

export default class Mongo {
  private static connection?: typeof mongoose;

  static async connect(uri: string) {
    if (!Mongo.connection) {
      Mongo.connection = await mongoose.connect(uri);
    }
  }

  static async disconnect() {
    if (Mongo.connection) {
      await Mongo.connection.disconnect();
      Mongo.connection = undefined;
    }
  }

  static async drop() {
    if (process.env.NODE_ENV === 'test') {
      const mappedModels = new Map(Object.entries(models));

      // eslint-disable-next-line no-restricted-syntax
      for (const [, value] of mappedModels) {
        // eslint-disable-next-line no-await-in-loop
        await value.collection.drop();
      }
    }
  }
}
