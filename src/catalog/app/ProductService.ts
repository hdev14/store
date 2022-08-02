import ProductNotFound from './ProductNotFound';
import { IProductOperations } from '../domain/IProductRepository';
import Product, { ProductParams } from '../domain/Product';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';
import IGenerateID from './IGenerateID';
import IStockService from '../domain/IStockService';

export default class ProductService implements IProductService {
  private repository: IProductOperations;

  private generateID: IGenerateID;

  private stockService: IStockService;

  constructor(
    repository: IProductOperations,
    generateID: IGenerateID,
    stockService: IStockService,
  ) {
    this.repository = repository;
    this.generateID = generateID;
    this.stockService = stockService;
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

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.repository.getProductsByCategory(categoryId);

    return products;
  }

  async createProduct(params: DefaultProductParams): Promise<Product> {
    const product = await this.repository.addProduct(new Product({
      id: this.generateID(),
      name: params.name,
      description: params.description,
      amount: params.amount,
      category: params.category,
      dimensions: params.dimensions,
      image: params.image,
      stockQuantity: params.stockQuantity,
      createdAt: new Date(),
    }));

    return product;
  }

  async updateProduct(productId: string, params: UpdateProductParams): Promise<Product> {
    const currentProduct = await this.repository.getProductById(productId);

    if (!currentProduct) {
      throw new ProductNotFound();
    }

    const productParams = {
      ...currentProduct,
      ...params,
    } as ProductParams;

    const product = new Product(productParams);

    const updatedProduct = await this.repository.updateProduct(product);

    return updatedProduct;
  }

  async updateProductStock(productId: string, quantity: number): Promise<boolean> {
    if (quantity < 0) {
      await this.stockService.removeFromStock(productId, Math.abs(quantity));
    } else {
      await this.stockService.addToStock(productId, Math.abs(quantity));
    }

    return true;
  }
}
