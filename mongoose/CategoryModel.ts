import { Schema, model } from 'mongoose';
import { IProduct } from './ProductModel';

export interface ICategory {
  id: string;
  name: string;
  code: number;
  products: IProduct[];
}

const categorySchema = new Schema<ICategory>({
  id: {
    type: String,
    required: true,
    index: true,
  },
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
