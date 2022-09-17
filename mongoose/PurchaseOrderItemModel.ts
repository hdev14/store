import { Schema, model } from 'mongoose';
import { IProduct } from './ProductModel';
import { IPurchaseOrder } from './PurchaseOrderModel';

export interface IPurchaseOrderItem {
  id: string;
  quantity: number;
  purchaseOrder: IPurchaseOrder;
  product: IProduct;
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
