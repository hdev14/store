import ProductNotFound from './ProductNotFound';
import { IProductOperations } from '../domain/IProductRepository';
import Product from '../domain/Product';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';

export default class ProductService implements IProductService {
  private repository: IProductOperations;

  constructor(repository: IProductOperations) {
    this.repository = repository;
  }

  async getProductById(productId: string): Promise<Product> {
    const product = await this.repository.getProductById(productId);

    if (!product) {
      throw new ProductNotFound();
    }

    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.repository.getAllProducts();

    return products;
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
