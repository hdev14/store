import IStockService from '@catalog/domain/IStockService';
import { fakeProducts } from '../fakes';

export class StockServiceStub implements IStockService {
  addToStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stock_quantity += quantity;

    return Promise.resolve(true);
  }

  removeFromStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stock_quantity -= quantity;

    return Promise.resolve(true);
  }
}

export default new StockServiceStub();
