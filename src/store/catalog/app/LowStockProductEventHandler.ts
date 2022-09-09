import { EventData, IEventHandler } from '@shared/@types/events';
import IEmailService from './IEmailService';

type LowStocKProductType = {
  productId: string;
  productName: string;
  productQuantity: number;
}

export default class LowStockProductEventHandler implements IEventHandler {
  private emailService: IEmailService;

  constructor(emailService: IEmailService) {
    this.emailService = emailService;
  }

  public handle<R = {}>(data: EventData<LowStocKProductType>): Promise<void | R> {
    console.info(data);

    // TODO: Send a notification(E-mail, SMS, etc);
    return Promise.resolve();
  }
}
