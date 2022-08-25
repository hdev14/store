import Event from '@shared/abstractions/Event';
import { IProductOperations } from './IProductRepository';
import IStockService from './IStockService';
import { LowStockProductData } from './LowStockProductEvent';

export default class StockService implements IStockService {
  private productRepository: IProductOperations;

  private lowStockProductEvent: Event<void, LowStockProductData>;

  constructor(
    productRepository: IProductOperations,
    lowStockProductEvent: Event<void, LowStockProductData>,
  ) {
    this.productRepository = productRepository;
    this.lowStockProductEvent = lowStockProductEvent;
  }

  public async addToStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.getProductById(productId);

    if (!product) {
      return false;
    }

    product.addToStock(quantity);

    await this.productRepository.updateProduct(product);

    return true;
  }

  public async removeFromStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.getProductById(productId);

    if (!product || !product.hasStockFor(quantity)) {
      return false;
    }

    product.removeFromStock(quantity);

    await this.productRepository.updateProduct(product);

    if (product.stockQuantity < 5) {
      await this.lowStockProductEvent.send({
        principalId: product.id,
        datetime: new Date().toISOString(),
        productName: product.name,
        productQuantity: product.stockQuantity,
      });
    }

    return true;
  }
}
