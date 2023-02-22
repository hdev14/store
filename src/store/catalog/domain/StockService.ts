import IMediator from '@shared/abstractions/IMediator';
import { IProductOperations } from './IProductRepository';
import IStockService from './IStockService';
import LowStockProductEvent from './LowStockProductEvent';

export default class StockService implements IStockService {
  constructor(
    private readonly productRepository: IProductOperations,
    private readonly mediator: IMediator,
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
      await this.mediator.send(new LowStockProductEvent(
        product.id,
        product.name,
        product.stockQuantity,
      ));
    }

    return true;
  }
}
