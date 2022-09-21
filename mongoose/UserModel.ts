import { Schema, model } from 'mongoose';
import { IPurchaseOrder } from './PurchaseOrderModel';

export interface IUser {
  _id: string;
  name: string;
  purchaseOrders: Array<string | IPurchaseOrder>;
}

const userSchema = new Schema<IUser>({
  _id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  purchaseOrders: [{
    type: String,
    ref: 'PurchaseOrder',
  }],
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
