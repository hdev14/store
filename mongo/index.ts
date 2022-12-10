import mongoose, { Model } from 'mongoose';
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

  static async dropCollections(collectionsToDrop: string[]) {
    if (process.env.NODE_ENV === 'test') {
      const promises = Object
        .entries<Model<any, {}, {}, any>>(models)
        .map(async ([, model]) => {
          if (collectionsToDrop.includes(model.collection.collectionName)) {
            await model.collection.drop();
          }
        });

      await Promise.all(promises);
    }
  }
}
