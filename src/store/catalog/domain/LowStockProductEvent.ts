import Event from '@shared/abstractions/Event';

export type LowStockProductData = {
  productName: string;
  productQuantity: number;
}

export default class LowStockProductEvent extends Event<LowStockProductData> {}
