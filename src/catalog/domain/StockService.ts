import IProductRepository from './IProductRepository';
import IStockService from './IStockService';

export default class StockService implements IStockService {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
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

    return true;
  }
}
