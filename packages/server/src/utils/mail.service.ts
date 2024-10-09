import { config } from '@config';
import nodemailer from 'nodemailer';
const { host, port, user, pass } = config.mail;
interface MailInfo {
  recipient: string;
  subject: string;
  text?: string;
  html?: string;
  from: string;
}
export default class EmailService {
  private mail = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass,
    },
  });
  async simpleSend({ recipient, subject, text, from, html }: MailInfo) {
    const mailOptions = {
      from: from,
      to: recipient,
      subject: subject,
      text: text,
      html: html,
    };
    return this.mail.sendMail(mailOptions);
  }
}
