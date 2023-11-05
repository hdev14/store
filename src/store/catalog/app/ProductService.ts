import IProductRepository from '@catalog/domain/IProductRepository';
import IStockService from '@catalog/domain/IStockService';
import Product, { ProductProps } from '@catalog/domain/Product';
import crypto from 'crypto';
import CategoryNotFoundError from './CategoryNotFoundError';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';
import ProductNotFoundError from './ProductNotFoundError';
import StockError from './StockError';

export default class ProductService implements IProductService {
  constructor(
    private readonly repository: IProductRepository,
    private readonly stock_service: IStockService,
  ) { }

  public async getProductById(product_id: string): Promise<ProductProps> {
    const product = await this.repository.getProductById(product_id);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product.toObject();
  }

  public async getAllProducts(): Promise<ProductProps[]> {
    const products = await this.repository.getAllProducts();

    const results: ProductProps[] = [];

    for (const product of products) {
      results.push(product.toObject());
    }

    return results;
  }

  public async getProductsByCategory(category_id: string): Promise<ProductProps[]> {
    const products = await this.repository.getProductsByCategory(category_id);

    const results: ProductProps[] = [];

    for (const product of products) {
      results.push(product.toObject());
    }

    return results;
  }

  public async createProduct(params: DefaultProductParams): Promise<ProductProps> {
    const category = await this.repository.getCategoryById(params.category_id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    const product = new Product({
      id: crypto.randomUUID(),
      name: params.name,
      description: params.description,
      amount: params.amount,
      dimensions: params.dimensions,
      image: params.image,
      stock_quantity: params.stock_quantity,
      created_at: new Date(),
      category,
    });

    await this.repository.addProduct(product);

    return product.toObject();
  }

  public async updateProduct(product_id: string, params: UpdateProductParams): Promise<ProductProps> {
    const current_product = await this.repository.getProductById(product_id);

    if (params.category_id && !(await this.repository.getCategoryById(params.category_id))) {
      throw new CategoryNotFoundError();
    }

    if (!current_product) {
      throw new ProductNotFoundError();
    }

    const props = {
      ...current_product,
      ...params,
    } as ProductProps;

    const product = new Product(props);

    await this.repository.updateProduct(product);

    return product.toObject();
  }

  public async updateProductStock(product_id: string, quantity: number): Promise<boolean> {
    const result = (quantity < 0)
      ? await this.stock_service.removeFromStock(product_id, Math.abs(quantity))
      : await this.stock_service.addToStock(product_id, Math.abs(quantity));

    if (!result) {
      throw new StockError();
    }

    return result;
  }
}
