import IStockService from '@catalog/domain/IStockService';
import { fakeProducts } from '../fakes';

export default class StockServiceStub implements IStockService {
  addToStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stockQuantity += quantity;

    return Promise.resolve(true);
  }

  removeFromStock(productId: string, quantity: number): Promise<boolean> {
    const index = fakeProducts.findIndex((p) => p.id === productId);

    fakeProducts[index].stockQuantity -= quantity;

    return Promise.resolve(true);
  }
}
