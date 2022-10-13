import { LowStockProductData } from '@catalog/domain/LowStockProductEvent';
import IEventHandler, { EventData } from '@shared/abstractions/IEventHandler';
import IEmailService from './IEmailService';

// eslint-disable-next-line max-len
export default class LowStockProductEventHandler implements IEventHandler<LowStockProductData> {
  private readonly emailService: IEmailService;

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
