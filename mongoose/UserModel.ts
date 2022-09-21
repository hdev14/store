import { Schema, model, Types } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  purchaseOrders: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  purchaseOrders: [{
    type: Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
  }],
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
