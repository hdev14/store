import { Schema, model } from 'mongoose';
import { ICategory } from './CategoryModel';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
  amount: number;
  image: string
  stockQuantity: number;
  category: ICategory;
  height: number;
  width: number;
  depth: number;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  height: {
    type: Number,
    default: 0,
    required: false,
  },
  width: {
    type: Number,
    default: 0,
    required: false,
  },
  depth: {
    type: Number,
    default: 0,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const ProductModel = model<IProduct>('Product', productSchema);

export default ProductModel;
