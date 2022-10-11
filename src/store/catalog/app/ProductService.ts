import IProductRepository from '@catalog/domain/IProductRepository';
import Product, { ProductParams } from '@catalog/domain/Product';
import IStockService from '@catalog/domain/IStockService';
import IGenerateID from '@shared/utils/IGenerateID';
import ProductNotFoundError from './ProductNotFoundError';
import IProductService, { DefaultProductParams, UpdateProductParams } from './IProductService';
import StockError from './StockError';
import CategoryNotFoundError from './CategoryNotFoundError';

export default class ProductService implements IProductService {
  private readonly repository: IProductRepository;

  private readonly generateID: IGenerateID;

  private readonly stockService: IStockService;

  constructor(
    repository: IProductRepository,
    generateID: IGenerateID,
    stockService: IStockService,
  ) {
    this.repository = repository;
    this.generateID = generateID;
    this.stockService = stockService;
  }

  public async getProductById(productId: string): Promise<Product> {
    const product = await this.repository.getProductById(productId);

    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }

  public async getAllProducts(): Promise<Product[]> {
    const products = await this.repository.getAllProducts();

    return products;
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.repository.getProductsByCategory(categoryId);

    return products;
  }

  public async createProduct(params: DefaultProductParams): Promise<Product> {
    const category = await this.repository.getCategoryById(params.categoryId);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    const product = await this.repository.addProduct(new Product({
      id: this.generateID(),
      name: params.name,
      description: params.description,
      amount: params.amount,
      dimensions: params.dimensions,
      image: params.image,
      stockQuantity: params.stockQuantity,
      createdAt: new Date(),
      category,
    }));

    return product;
  }

  public async updateProduct(productId: string, params: UpdateProductParams): Promise<Product> {
    const currentProduct = await this.repository.getProductById(productId);

    if (params.categoryId && !(await this.repository.getCategoryById(params.categoryId))) {
      throw new CategoryNotFoundError();
    }

    if (!currentProduct) {
      throw new ProductNotFoundError();
    }

    const productParams = {
      ...currentProduct,
      ...params,
    } as ProductParams;

    const product = new Product(productParams);

    const updatedProduct = await this.repository.updateProduct(product);

    return updatedProduct;
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
