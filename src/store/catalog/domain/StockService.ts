import Event from '@shared/abstractions/Event';
import { IProductOperations } from './IProductRepository';
import IStockService from './IStockService';
import { LowStockProductData } from './LowStockProductEvent';

export default class StockService implements IStockService {
  constructor(
    private readonly productRepository: IProductOperations,
    private readonly lowStockProductEvent: Event<LowStockProductData>,
  ) { }

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
        timestamp: new Date().toISOString(),
        productName: product.name,
        productQuantity: product.stockQuantity,
      });
    }

    return true;
  }
}
