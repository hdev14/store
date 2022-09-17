import { Schema, model } from 'mongoose';
import { IPurchaseOrderItem } from './PurchaseOrderItemModel';
import { IUser } from './UserModel';
import { IVoucher } from './VoucherModel';

export interface IPurchaseOrder {
  id: string;
  code: number;
  client: IUser;
  voucher: IVoucher;
  discountAmount: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: IPurchaseOrderItem[];
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>({
  id: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: Number,
    required: true,
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  voucher: {
    type: Schema.Types.ObjectId,
    ref: 'Voucher',
    required: false,
  },
  discountAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  totalAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'PurchaseOrderItem',
  }],
  createdAt: {
    type: Date,
    required: true,
  },
});

const PurchaseOrderModel = model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrderModel;
