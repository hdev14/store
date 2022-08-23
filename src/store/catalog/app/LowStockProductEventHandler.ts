import { EventData, IEventHandler } from '@shared/@types/events';

type LowStocKProductType = {
  productId: string;
  productName: string;
  productQuantity: number;
}

export default class LowStockProductEventHandler implements IEventHandler {
  handle<R = {}>(data: EventData<LowStocKProductType>): void | R | Promise<void | R> {
    console.info(data);

    // TODO: Send a notification(E-mail, SMS, etc);

    throw new Error('Method not implemented.');
  }
}
