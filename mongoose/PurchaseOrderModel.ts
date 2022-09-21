import { Schema, model, Types } from 'mongoose';

export interface IPurchaseOrder {
  id: string;
  code: number;
  client: Types.ObjectId;
  voucher: Types.ObjectId;
  discountAmount: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: Types.ObjectId[];
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
