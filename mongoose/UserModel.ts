import { Schema, model } from 'mongoose';
import { IPurchaseOrder } from './PurchaseOrderModel';

export interface IUser {
  id: string;
  name: string;
  purchaseOrders: IPurchaseOrder[]
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
