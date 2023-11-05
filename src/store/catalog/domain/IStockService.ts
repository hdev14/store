interface IStockService {
  addToStock(product_id: string, quantity: number): Promise<boolean>;

  removeFromStock(product_id: string, quantity: number): Promise<boolean>;
}

export default IStockService;
