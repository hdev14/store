import Event from '@shared/abstractions/Event';
import { IProductOperations } from './IProductRepository';
import IStockService from './IStockService';

export default class StockService implements IStockService {
  private productRepository: IProductOperations;

  private lowStockProductEvent: Event;

  constructor(productRepository: IProductOperations, lowStockProductEvent: Event) {
    this.productRepository = productRepository;
    this.lowStockProductEvent = lowStockProductEvent;
  }

  async addToStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.getProductById(productId);

    if (!product) {
      return false;
    }

    product.addToStock(quantity);

    await this.productRepository.updateProduct(product);

    return true;
  }

  async removeFromStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.getProductById(productId);

    if (!product || !product.hasStockFor(quantity)) {
      return false;
    }

    product.removeFromStock(quantity);

    await this.productRepository.updateProduct(product);

    if (product.stockQuantity < 5) {
      await this.lowStockProductEvent.send({
        productId: product.id,
        quantity: product.stockQuantity,
      });
    }

    return true;
  }
}
