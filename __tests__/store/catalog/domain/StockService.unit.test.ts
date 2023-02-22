import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import Product from '@catalog/domain/Product';
import StockService from '@catalog/domain/StockService';
import mediatorStub from '../../stubs/MediatorStub';
import productRepositoryStub from '../../stubs/ProductRepositoryStub';

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

describe('StockService\'s Unit Tests', () => {
  describe('StockService.removeFromStock()', () => {
    it('returns false if product doesn\'t exist', async () => {
      expect.assertions(1);

      const currentGetProductById = productRepositoryStub.getProductById;
      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve(null));

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);

      productRepositoryStub.getProductById = currentGetProductById;
    });

    it('returns false if product doesn\'t have stock', async () => {
      expect.assertions(1);

      const currentGetProductById = productRepositoryStub.getProductById;

      (fakeProduct.hasStockFor as jest.Mock).mockReturnValueOnce(false);

      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve(fakeProduct));

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      const result = await stockService.removeFromStock('test_product_id', 1);

      expect(result).toBe(false);

      productRepositoryStub.getProductById = currentGetProductById;
    });

    it('removes a quantity of products from stock', async () => {
      productRepositoryStub.getProductById = jest.fn().mockResolvedValueOnce(fakeProduct);
      const updateProductSpy = jest.spyOn(productRepositoryStub, 'updateProduct');
      const removeFromStockSpy = jest.spyOn(fakeProduct, 'removeFromStock');

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      const result = await stockService.removeFromStock('test_product_id', 5);

      expect(result).toBe(true);
      expect(removeFromStockSpy).toHaveBeenCalledWith(5);
      expect(updateProductSpy).toHaveBeenCalledWith(fakeProduct);
    });

    it('calls Mediator.send if stockQuantity is less then 5', async () => {
      expect.assertions(5);

      productRepositoryStub.getProductById = jest.fn(() => Promise.resolve({
        id: 'test_product_id_test',
        name: 'test_product',
        stockQuantity: 10,
        addToStock(quantity: number) {
          this.stockQuantity += quantity;
        },
        removeFromStock(quantity: number) {
          this.stockQuantity -= quantity;
        },
        hasStockFor: jest.fn(() => true),
      } as any));

      const sendSpy = jest.spyOn(mediatorStub, 'send');

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      await stockService.removeFromStock('test_product_id_test', 6);

      expect(sendSpy).toHaveBeenCalledTimes(1);

      const event = sendSpy.mock.calls[0][0] as LowStockProductEvent;

      expect(event.principalId).toEqual('test_product_id_test');
      expect(event.productName).toEqual('test_product');
      expect(event.productQuantity).toEqual(4);
      expect(event.date).toBeInstanceOf(Date);
    });
  });

  describe('StockService.addToStock()', () => {
    it('returns false if product doesn\'t exist', async () => {
      expect.assertions(1);

      productRepositoryStub.getProductById = jest.fn().mockResolvedValueOnce(null);

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(false);
    });

    it('adds a quantity of products', async () => {
      expect.assertions(3);

      productRepositoryStub.getProductById = jest.fn().mockResolvedValueOnce(fakeProduct);
      const updateProductSpy = jest.spyOn(productRepositoryStub, 'updateProduct');
      const addToStockSpy = jest.spyOn(fakeProduct, 'addToStock');

      const stockService = new StockService(productRepositoryStub, mediatorStub);
      const result = await stockService.addToStock('test_product_id', 1);

      expect(result).toBe(true);
      expect(addToStockSpy).toHaveBeenCalledWith(1);
      expect(updateProductSpy).toHaveBeenCalledWith(fakeProduct);
    });
  });
});
