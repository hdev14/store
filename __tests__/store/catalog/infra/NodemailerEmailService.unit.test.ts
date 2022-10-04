import { EmailParams } from '@catalog/app/IEmailService';
import NodemailerEmailService from '@catalog/infra/notification/NodemailerEmailService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');
const nodemailerMock = jest.mocked(nodemailer);

describe("NodemailerEmailService's unit tests", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'mock',
      EMAIL_HOST: 'smtp://test',
      EMAIL_HOST_PORT: '123',
      EMAIL_USER: 'test_user',
      EMAIL_PASS: 'test_pass',
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('calls nodemailer.createTransport when instanciate a new NodemailerEmailService', () => {
    // eslint-disable-next-line no-new
    new NodemailerEmailService();

    expect(nodemailerMock.createTransport).toHaveBeenCalledTimes(1);
    expect(nodemailerMock.createTransport).toHaveBeenCalledWith({
      host: 'smtp://test',
      port: '123',
      secure: false,
      auth: {
        user: 'test_user',
        pass: 'test_pass',
      },
    });
  });

  it('calls nodemailer.sendEmail', async () => {
    expect.assertions(2);

    const sendMailMock = jest.fn();

    nodemailerMock.createTransport = jest.fn().mockReturnValueOnce({
      sendMail: sendMailMock,
    } as any);

    const params: EmailParams = {
      from: 'test1@email.com',
      subject: 'test',
      to: 'test2@email.com',
      html: '<p>test</p>',
      text: 'test',
    };

    // eslint-disable-next-line no-new
    const emailService = new NodemailerEmailService();

    await emailService.send(params);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'test1@email.com',
      to: 'test2@email.com',
      subject: 'test',
      text: 'test',
      html: '<p>test</p>',
    });
  });
});
