import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import IHandler from '@shared/abstractions/IHandler';
import IEmailService from './IEmailService';

// eslint-disable-next-line max-len
export default class LowStockProductEventHandler implements IHandler<LowStockProductEvent, void> {
  private static defaultEmail = 'default@email.com';

  constructor(private readonly emailService: IEmailService) {}

  public async handle(event: LowStockProductEvent): Promise<void> {
    await this.emailService.send({
      from: LowStockProductEventHandler.defaultEmail,
      to: LowStockProductEventHandler.defaultEmail,
      subject: 'Produto com baixo estoque!',
      text: `O produto ${event.productName} com ID ${event.principalId}, está apenas com ${event.productQuantity} de quantitade.`,
      html: `<p>O produto ${event.productName} com ID ${event.principalId}, está apenas com ${event.productQuantity} de quantitade.</p>`,
    });
  }
}
