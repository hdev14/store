import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import IHandler from '@shared/abstractions/IHandler';
import IEmailService from './IEmailService';

// eslint-disable-next-line max-len
export default class LowStockProductEventHandler implements IHandler<LowStockProductEvent, void> {
  private static default_email = 'default@email.com';

  constructor(private readonly email_service: IEmailService) {}

  public async handle(event: LowStockProductEvent): Promise<void> {
    await this.email_service.send({
      from: LowStockProductEventHandler.default_email,
      to: LowStockProductEventHandler.default_email,
      subject: 'Produto com baixo estoque!',
      text: `O produto ${event.product_name} com ID ${event.principal_id}, está apenas com ${event.product_quantity} de quantitade.`,
      html: `<p>O produto ${event.product_name} com ID ${event.principal_id}, está apenas com ${event.product_quantity} de quantitade.</p>`,
    });
  }
}
