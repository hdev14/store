/* eslint-disable max-classes-per-file */
import { IProductOperations } from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import StockService from '@catalog/domain/StockService';
import { EventData } from '@shared/@types/events';
import Event from '@shared/abstractions/Event';

const fakeProduct: any = {
  stockQuantity: 10,
  addToStock(quantity: number) {
    this.stockQuantity += quantity;
  },
  removeFromStock(quantity: number) {
    this.stockQuantity -= quantity;
  },
  hasStockFor: jest.fn(() => true),
};

class LowStockProductEventStub extends Event {
  constructor() {
    super({} as any);
  }

  send<R>(eventData: EventData): Promise<void | R> {
    console.info(eventData);
    return Promise.resolve();
  }
}

class ProductRepositoryStub implements IProductOperations {
  getProductsByCategory(_: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getAllProducts(): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getProductById(_: string): Promise<Product | null> {
    return Promise.resolve(fakeProduct);
  }

  addProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }

  updateProduct(_: Product): Product | Promise<Product> {
    throw new Error('Method not implemented.');
  }
}

describe('StockService\'s Unit Tests', () => {
  describe('StockService.removeFromStock', () => {
    it('returns false if product doesn\'t exist', async () => {
      const productRepositoryStub = new ProductRepositoryStub();
      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve(null));

      const stockService = new StockService(productRepositoryStub, new LowStockProductEventStub());
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('returns false if product doesn\'t have stock', async () => {
      const productRepositoryStub = new ProductRepositoryStub();
      (fakeProduct.hasStockFor as jest.Mock).mockReturnValueOnce(false);

      const stockService = new StockService(productRepositoryStub, new LowStockProductEventStub());
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('removes a quantity of products from stock', async () => {
      const productRepositoryStub = new ProductRepositoryStub();
      productRepositoryStub.updateProduct = jest.fn(() => Promise.resolve({} as Product));
      const removeFromStockSpy = jest.spyOn(fakeProduct, 'removeFromStock');

      const stockService = new StockService(productRepositoryStub, new LowStockProductEventStub());
      const result = await stockService.removeFromStock('test_product_id', 5);

      expect(result).toBe(true);
      expect(removeFromStockSpy).toHaveBeenCalledWith(5);
      expect(productRepositoryStub.updateProduct).toHaveBeenCalledWith(fakeProduct);
    });

    it('calls LowStockProductEvent.send if stockQuantity is less then 5', async () => {
      expect.assertions(2);

      const productRepositoryStub = new ProductRepositoryStub();
      productRepositoryStub.updateProduct = jest.fn(() => Promise.resolve({} as Product));
      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve({
        id: 'test_product_id_test',
        stockQuantity: 10,
        addToStock(quantity: number) {
          this.stockQuantity += quantity;
        },
        removeFromStock(quantity: number) {
          this.stockQuantity -= quantity;
        },
        hasStockFor: jest.fn(() => true),
      } as any));

      const lowStockProductEventStub = new LowStockProductEventStub();
      const sendSpy = jest.spyOn(lowStockProductEventStub, 'send');

      const stockService = new StockService(productRepositoryStub, lowStockProductEventStub);
      await stockService.removeFromStock('test_product_id_test', 6);

      expect(sendSpy).toHaveBeenCalledTimes(1);
      expect(sendSpy).toHaveBeenCalledWith({
        productId: 'test_product_id_test',
        quantity: 4,
      });
    });
  });

  describe('StockService.addToStock', () => {
    it('returns false if product doesn\'t exist', async () => {
      const productRepositoryStub = new ProductRepositoryStub();
      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve(null));

      const stockService = new StockService(productRepositoryStub, new LowStockProductEventStub());
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('removes a quantity of products from stock', async () => {
      const productRepositoryStub = new ProductRepositoryStub();
      productRepositoryStub.updateProduct = jest.fn(() => Promise.resolve({} as Product));
      const addToStockSpy = jest.spyOn(fakeProduct, 'addToStock');

      const stockService = new StockService(productRepositoryStub, new LowStockProductEventStub());
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(true);
      expect(addToStockSpy).toHaveBeenCalledWith(1);
      expect(productRepositoryStub.updateProduct).toHaveBeenCalledWith(fakeProduct);
    });
  });
});
