import IEmailService, { EmailParams } from '@catalog/app/IEmailService';
import nodemailer from 'nodemailer';

export default class NodemailerEmailService implements IEmailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_HOST_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    } as any);
  }

  public async send(params: EmailParams): Promise<void> {
    try {
      if (process.env.NODE_ENV !== 'test') {
        const message_info = await this.transporter.sendMail({
          from: params.from,
          to: typeof params.to === 'string' ? params.to : params.to.join(', '),
          subject: params.subject,
          text: params.text,
          html: params.html,
        });

        console.info(message_info);
      }
    } catch (e: any) {
      console.error(e.stack);
    }
  }
}
