import { Schema, model } from 'mongoose';

export interface IPurchaseOrder {
  id: string;
  code: number;
  clientId: string;
  voucherId?: string;
  discountAmount: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
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
  clientId: {
    type: String,
    required: true,
  },
  voucherId: {
    type: String,
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
  createdAt: {
    type: Date,
    required: true,
  },
});

const PurchaseOrderModel = model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrderModel;
