/* eslint-disable no-unused-vars */
import Category from '../domain/Category';
import Dimensions from '../domain/Dimensions';
import Product from '../domain/Product';

export type DefaultProductParams = {
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  dimensions: Dimensions;
  category: Category;
}

export type UpdateProductParams = Partial<DefaultProductParams>;

interface IProductService {
  getProductById(productId: string): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(params: DefaultProductParams): Promise<Product>;
  updateProduct(productId: string, params: UpdateProductParams): Promise<Product>;
  updateProductStock(productId: string, quantity: number): Promise<boolean>;
}

export default IProductService;
