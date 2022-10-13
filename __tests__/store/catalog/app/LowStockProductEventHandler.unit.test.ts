import IEmailService, { EmailParams } from '@catalog/app/IEmailService';
import LowStockProductEventHandler, { } from '@catalog/app/LowStockProductEventHandler';
import { LowStockProductData } from '@catalog/domain/LowStockProductEvent';
import { faker } from '@faker-js/faker';
import { EventData } from '@shared/abstractions/IEventHandler';

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

    const data: EventData<LowStockProductData> = {
      principalId: faker.datatype.uuid(),
      productName: faker.commerce.product(),
      productQuantity: parseInt(faker.datatype.number().toString(), 10),
      timestamp: new Date().toISOString(),
    };

    await lowStockProductEventHandler.handle(data);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      from: 'default@email.com',
      to: 'default@email.com',
      subject: 'Produto com baixo estoque!',
      text: `O produto ${data.productName} com ID ${data.principalId}, está apenas com ${data.productQuantity} de quantitade.`,
      html: `<p>O produto ${data.productName} com ID ${data.principalId}, está apenas com ${data.productQuantity} de quantitade.</p>`,
    });
  });
});
