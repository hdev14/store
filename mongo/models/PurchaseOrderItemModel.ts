import { Schema, model } from 'mongoose';
import { IProduct } from './ProductModel';
import { IPurchaseOrder } from './PurchaseOrderModel';

export interface IPurchaseOrderItem {
  _id: string;
  quantity: number;
  purchaseOrder: string | IPurchaseOrder;
  product: string | IProduct;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>({
  _id: String,
  quantity: {
    type: Number,
    required: true,
  },
  purchaseOrder: {
    type: String,
    ref: 'PurchaseOrder',
  },
  product: {
    type: String,
    ref: 'Product',
  },
});

const PurchaseOrderItemModel = model<IPurchaseOrderItem>('PurchaseOrderItem', purchaseOrderItemSchema);

export default PurchaseOrderItemModel;
