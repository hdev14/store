export type Email = string;

export type EmailParams = {
  from: Email;
  subject: string;
  to: Email | Email[];
  text?: string;
  html?: string;
}

interface IEmailService {
  send(params: EmailParams): Promise<void>;
}

export default IEmailService;
