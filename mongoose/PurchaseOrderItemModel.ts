import { Schema, model } from 'mongoose';

export interface IPurchaseOrderItem {
  id: string;
  quantity: number;
  purchaseOrderId: string;
  productId: string;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>({
  id: {
    type: String,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  purchaseOrderId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
});

const PurchaseOrderItemModel = model<IPurchaseOrderItem>('PurchaseOrderItem', purchaseOrderItemSchema);

export default PurchaseOrderItemModel;
