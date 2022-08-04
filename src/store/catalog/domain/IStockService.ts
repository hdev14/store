/* eslint-disable no-unused-vars */
interface IStockService {
  addToStock(productId: string, quantity: number): Promise<boolean>;
  removeFromStock(productId: string, quantity: number): Promise<boolean>;
}

export default IStockService;
