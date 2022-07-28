import Product from '../domain/Product';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';

export default class ProductService implements IProductService {
  getProductById(productId: string): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  getAllProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getProductsByCategory(categoryId: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  createProduct(params: DefaultProductParams): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  updateProduct(productId: string, params: UpdateProductParams): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  updateProductStock(productId: string, quantity: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
