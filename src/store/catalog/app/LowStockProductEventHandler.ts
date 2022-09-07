import { EventData, IEventHandler } from '@shared/@types/events';

type LowStocKProductType = {
  productId: string;
  productName: string;
  productQuantity: number;
}

export default class LowStockProductEventHandler implements IEventHandler {
  public handle<R = {}>(data: EventData<LowStocKProductType>): Promise<void | R> {
    console.info(data);

    // TODO: Send a notification(E-mail, SMS, etc);
    return Promise.resolve();
  }
}
