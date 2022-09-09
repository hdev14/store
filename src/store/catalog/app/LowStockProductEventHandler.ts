import { LowStockProductData } from '@catalog/domain/LowStockProductEvent';
import { EventData, IEventHandler } from '@shared/@types/events';
import IEmailService from './IEmailService';

export default class LowStockProductEventHandler implements IEventHandler {
  private emailService: IEmailService;

  private static defaultEmail = 'default@email.com';

  constructor(emailService: IEmailService) {
    this.emailService = emailService;
  }

  public async handle(data: EventData<LowStockProductData>): Promise<void> {
    await this.emailService.send({
      from: LowStockProductEventHandler.defaultEmail,
      to: LowStockProductEventHandler.defaultEmail,
      subject: 'Produto com baixo estoque!',
      text: `O produto ${data.productName} com ID ${data.principalId}, está apenas com ${data.productQuantity} de quantitade.`,
      html: `<p>O produto ${data.productName} com ID ${data.principalId}, está apenas com ${data.productQuantity} de quantitade.</p>`,
    });
  }
}
