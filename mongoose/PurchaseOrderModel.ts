import { Schema, model } from 'mongoose';
import { IPurchaseOrderItem } from './PurchaseOrderItemModel';

export interface IPurchaseOrder {
  _id: string;
  code: number;
  customer: string;
  voucher: string;
  discountAmount: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: Array<string | IPurchaseOrderItem>;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>({
  _id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  code: {
    type: Number,
    required: true,
  },
  customer: {
    type: String,
    ref: 'User',
  },
  voucher: {
    type: String,
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
    type: String,
    ref: 'PurchaseOrderItem',
  }],
  createdAt: {
    type: Date,
    required: true,
  },
});

const PurchaseOrderModel = model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrderModel;
