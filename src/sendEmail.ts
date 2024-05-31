import { ContactRequest } from './validate';
import formData from 'form-data';
import Mailgun, { MessagesSendResult } from 'mailgun.js';

declare const MAILGUN_API_KEY: string;
declare const MAILGUN_DOMAIN: string;
declare const RECIPIENT_NAME: string;
declare const RECIPIENT_EMAIL: string;
declare const MAIL_SUBJECT: string;

export const sendEmail = (contactRequest: ContactRequest): Promise<MessagesSendResult> => {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', key: MAILGUN_API_KEY});

    return mg.messages.create(MAILGUN_DOMAIN, {
        from: `${RECIPIENT_NAME} <${RECIPIENT_EMAIL}>`,
        to: [RECIPIENT_NAME],
        subject: MAIL_SUBJECT,
        text: `Received a new contact form request from:
Name: ${contactRequest.from.name}
Email: ${contactRequest.from.email}
Phone: ${contactRequest.from.phone}

Message:

${contactRequest.message}
        `
    });
}
