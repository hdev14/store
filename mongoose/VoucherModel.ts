import { Schema, model } from 'mongoose';
import { IPurchaseOrder } from './PurchaseOrderModel';

export interface IVoucher {
  id: string;
  code: number;
  percentageAmount: number;
  rawDiscountAmount: number;
  quantity: number;
  type: number;
  active: boolean;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date;
  purchaseOrders: IPurchaseOrder[];
}

const voucherSchema = new Schema<IVoucher>({
  id: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: Number,
    required: true,
  },
  percentageAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  rawDiscountAmount: {
    type: Number,
    default: 0,
    required: false,
  },
  quantity: {
    type: Number,
    default: 1,
    required: false,
  },
  type: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usedAt: {
    type: Date,
    required: false,
  },
  purchaseOrders: [{
    type: Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
  }],
});

const VoucherModel = model<IVoucher>('Voucher', voucherSchema);

export default VoucherModel;
