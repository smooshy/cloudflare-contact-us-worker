import { Contact, ContactRequest } from './validate';

declare const FROM_EMAIL: string;
declare const MAIL_SUBJECT: string;
declare const MAILGUN_API_KEY: string;
declare const MAILGUN_API_BASE_URL: string;
declare const MAILGUN_TEMPLATE: string;
declare const RECIPIENT_EMAIL: string;

export interface EmailData {
    from: string
    to: string
    subject: string
    template?: string
    text?: string
    html?: string
    cc?: string
    bcc?: string
    "h-Reply-To"?: string
    "h:X-Mailgun-Variables"?: string
    "o:testmode"?: boolean
}

function urlEncodeObject(obj: {[s: string]: any}) {
    return Object.keys(obj)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
        .join("&");
}

function emailDataFromContactRequest(contactRequest: ContactRequest): EmailData {
    const templateVars = {
        name: contactRequest.from.name,
        email: contactRequest.from.email,
        phone: contactRequest.from.phone,
        question: contactRequest.message,
    };

    return {
        from: FROM_EMAIL,
        to: RECIPIENT_EMAIL,
        subject: MAIL_SUBJECT,
        template: MAILGUN_TEMPLATE,
        "h:X-Mailgun-Variables": JSON.stringify(templateVars),
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
