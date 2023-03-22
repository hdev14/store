import crypto from 'crypto';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product, { ProductProps } from '@catalog/domain/Product';
import IStockService from '@catalog/domain/IStockService';
import ProductNotFoundError from './ProductNotFoundError';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';
import StockError from './StockError';
import CategoryNotFoundError from './CategoryNotFoundError';

export default class ProductService implements IProductService {
  constructor(
    private readonly repository: IProductRepository,
    private readonly stockService: IStockService,
  ) { }

  public async getProductById(productId: string): Promise<ProductProps> {
    const product = await this.repository.getProductById(productId);

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

  public async getProductsByCategory(categoryId: string): Promise<ProductProps[]> {
    const products = await this.repository.getProductsByCategory(categoryId);

    const results: ProductProps[] = [];

    for (const product of products) {
      results.push(product.toObject());
    }

    return results;
  }

  public async createProduct(params: DefaultProductParams): Promise<ProductProps> {
    const category = await this.repository.getCategoryById(params.categoryId);

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
      stockQuantity: params.stockQuantity,
      createdAt: new Date(),
      category,
    });

    await this.repository.addProduct(product);

    return product.toObject();
  }

  public async updateProduct(productId: string, params: UpdateProductParams): Promise<ProductProps> {
    const currentProduct = await this.repository.getProductById(productId);

    if (params.categoryId && !(await this.repository.getCategoryById(params.categoryId))) {
      throw new CategoryNotFoundError();
    }

    if (!currentProduct) {
      throw new ProductNotFoundError();
    }

    const props = {
      ...currentProduct,
      ...params,
    } as ProductProps;

    const product = new Product(props);

    await this.repository.updateProduct(product);

    return product.toObject();
  }

  public async updateProductStock(productId: string, quantity: number): Promise<boolean> {
    const result = (quantity < 0)
      ? await this.stockService.removeFromStock(productId, Math.abs(quantity))
      : await this.stockService.addToStock(productId, Math.abs(quantity));

    if (!result) {
      throw new StockError();
    }

    return result;
  }
}
