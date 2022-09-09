/* eslint-disable no-unused-vars */
type Email = string;

type EmailDefaultParams = {
  from: Email;
  subject: string;
  to: Email | Email[];
}

type EmailTextParams = EmailDefaultParams & {
  text: string;
}

type EmailHtmlParams = EmailDefaultParams & {
  html: string;
}

type EmailParams = EmailDefaultParams & {
  text?: string;
  html?: string;
}

interface IEmailService {
  sendText(params: EmailTextParams): Promise<void>;
  sendHtml(params: EmailHtmlParams): Promise<void>;
  send(params: EmailParams): Promise<void>;
}

export default IEmailService;
