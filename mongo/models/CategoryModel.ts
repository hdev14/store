import { Schema, model } from 'mongoose';
import { IProduct } from './ProductModel';

export interface ICategory {
  _id: string;
  name: string;
  code: number;
  products: Array<string | IProduct>;
}

const categorySchema = new Schema<ICategory>({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
});

const CategoryModel = model<ICategory>('Category', categorySchema);

export default CategoryModel;
