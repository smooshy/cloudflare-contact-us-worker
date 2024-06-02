import { Contact, ContactRequest } from './validate';

declare const MAILGUN_API_KEY: string;
declare const MAILGUN_API_BASE_URL: string;
// declare const RECIPIENT_NAME: string;
declare const RECIPIENT_EMAIL: string;
declare const MAIL_SUBJECT: string;

export interface EmailData {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string
    cc?: string;
    bcc?: string;
    "h-Reply-To"?: string;
    "o:testmode"?: boolean;
}

function urlEncodeObject(obj: {[s: string]: any}) {
    return Object.keys(obj)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
        .join("&");
}

function emailDataFromContactRequest(contactRequest: ContactRequest): EmailData {
    const body = 'Received a new contact form request from:\n\n' +
                `Name: ${contactRequest.from.name}\n` +
                `Email: ${contactRequest.from.email}\n` +
                `Phone: ${contactRequest.from.phone}\n\n`  +
                'Message:\n\n' +
                contactRequest.message;

    return {
        from: contactRequest.from.email,
        to: RECIPIENT_EMAIL,
        subject: MAIL_SUBJECT,
        text: body,
        html: body,
    };
}

export function sendMail(contactRequest: ContactRequest): Promise<Response> {
    const dataUrlEncoded = urlEncodeObject(emailDataFromContactRequest(contactRequest));
    const opts = {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa("api:" + MAILGUN_API_KEY),
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": dataUrlEncoded.length.toString()
        },
        body: dataUrlEncoded,
    };

    return fetch(`${MAILGUN_API_BASE_URL}/messages`, opts);
}
