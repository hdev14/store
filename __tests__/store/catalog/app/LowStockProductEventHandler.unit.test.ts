import IEmailService, { EmailParams } from '@catalog/app/IEmailService';
import LowStockProductEventHandler, { } from '@catalog/app/LowStockProductEventHandler';
import LowStockProductEvent from '@catalog/domain/LowStockProductEvent';
import { faker } from '@faker-js/faker';

class EmailServiceStub implements IEmailService {
  send(_: EmailParams): Promise<void> {
    return Promise.resolve();
  }
}

describe("LowStockProductEventHandler's unit tests", () => {
  it('calls EmailService.send with correct params', async () => {
    expect.assertions(2);

    const emailServiceStub = new EmailServiceStub();
    const sendSpy = jest.spyOn(emailServiceStub, 'send');

    const lowStockProductEventHandler = new LowStockProductEventHandler(emailServiceStub);

    const event = new LowStockProductEvent(
      faker.datatype.uuid(),
      faker.commerce.product(),
      parseInt(faker.datatype.number().toString(), 10),
    );

    await lowStockProductEventHandler.handle(event);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      from: 'default@email.com',
      to: 'default@email.com',
      subject: 'Produto com baixo estoque!',
      text: `O produto ${event.productName} com ID ${event.principalId}, está apenas com ${event.productQuantity} de quantitade.`,
      html: `<p>O produto ${event.productName} com ID ${event.principalId}, está apenas com ${event.productQuantity} de quantitade.</p>`,
    });
  });
});
