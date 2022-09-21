import { Schema, model, Types } from 'mongoose';

export interface IPurchaseOrderItem {
  id: string;
  quantity: number;
  purchaseOrder: Types.ObjectId;
  product: Types.ObjectId;
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
  purchaseOrder: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const PurchaseOrderItemModel = model<IPurchaseOrderItem>('PurchaseOrderItem', purchaseOrderItemSchema);

export default PurchaseOrderItemModel;
