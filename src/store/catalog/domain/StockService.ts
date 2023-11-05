import IMediator from '@shared/abstractions/IMediator';
import { IProductOperations } from './IProductRepository';
import IStockService from './IStockService';
import LowStockProductEvent from './LowStockProductEvent';

export default class StockService implements IStockService {
  constructor(
    private readonly repository: IProductOperations,
    private readonly mediator: IMediator,
  ) { }

  public async addToStock(product_id: string, quantity: number): Promise<boolean> {
    const product = await this.repository.getProductById(product_id);

    if (!product) {
      return false;
    }

    product.addToStock(quantity);

    await this.repository.updateProduct(product);

    return true;
  }

  public async removeFromStock(product_id: string, quantity: number): Promise<boolean> {
    const product = await this.repository.getProductById(product_id);

    if (!product || !product.hasStockFor(quantity)) {
      return false;
    }

    product.removeFromStock(quantity);

    await this.repository.updateProduct(product);

    if (product.stock_quantity < 5) {
      await this.mediator.send(new LowStockProductEvent(
        product.id,
        product.name,
        product.stock_quantity,
      ));
    }

    return true;
  }
}
