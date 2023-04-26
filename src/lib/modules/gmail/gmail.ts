import type { Company } from "@prisma/client";
import { GmailAuth } from "./oauth";
import { google, gmail_v1 } from 'googleapis'
import { ParseGmailApi, type IEmail } from 'gmail-api-parse-message-ts';
import MailComposer from 'nodemailer/lib/mail-composer';

export class Gmailer {
    private static _instances: { [id: number]: Gmailer } = {} as any;
    private _company: Company;
    private authenticated: Promise<boolean>;
    private gmail = google.gmail('v1')
    private parser = new ParseGmailApi();

    public static getInstance(company: Company) {
        const id = company.id;
        console.log(Gmailer._instances);
        if (!Gmailer._instances[id]) {
            Gmailer._instances[id] = new Gmailer(company);
        }

        return Gmailer._instances[id];
    }

    private constructor(company: Company) {
        this._company = company;
        const id = company.id;
        const gmailAuth = new GmailAuth(id);
        this.authenticated = (async () => await gmailAuth.authorize())();
    }

    public async getMessages(params: gmail_v1.Params$Resource$Users$Messages$List): Promise<IEmail[]> {
        await this.ensureAuth();
        const response = await this.gmail.users.messages.list({ userId: 'me', ...params });
        const responseMessages = response.data.messages;
        if (!responseMessages)
            return [];

        const messages = await Promise.all(responseMessages.map(async message => {
            if (!message.id)
                return null;
            return this.getMessage(message.id);
        }));

        // removes nulls
        return messages.flatMap(f => !!f ? [f] : []);
    }


    public async getMessage(messageId: string, fields = 'id,threadId,labelIds,payload,snippet'): Promise<IEmail> {
        await this.ensureAuth();
        const response = await this.gmail.users.messages.get({ id: messageId, userId: 'me', fields })
        const message = this.parser.parseMessage(response.data)

        return message
    }

    public async getAttachment(attachmentId: string, messageId: string): Promise<gmail_v1.Schema$MessagePartBody> {
        await this.ensureAuth();
        const response = await this.gmail.users.messages.attachments.get({
            id: attachmentId, messageId, userId: 'me'
        })
        const attachment = response.data
        return attachment;
    }

    public async getThread(messageId: string): Promise<IEmail[]> {
        await this.ensureAuth();
        const response = await this.gmail.users.threads.get({ id: messageId, userId: 'me' });
        const responseMessages = response.data.messages;
        if (!responseMessages)
            return [];
        const messages = await Promise.all(responseMessages.map(async (message) => {
            if (!message || !message.id)
                return null;
            return this.getMessage(message.id);
        }));

        return messages.flatMap(f => !!f ? [f] : []);
    }

    public async sendMessage(to: string, subject: string, text = '', attachments = []) {
        const buildMessage = () => new Promise<string>((resolve, reject) => {
            const message = new MailComposer({
                to,
                subject,
                text,
                attachments,
                textEncoding: 'base64'
            });

            message.compile().build((err, msg) => {
                if (err) {
                    reject(err);
                }

                const encodedMessage = Buffer.from(msg)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                resolve(encodedMessage);
            });
        });

        const encodedMessage = await buildMessage();
        await this.ensureAuth();
        await this.gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });
    }

    public async getMessageFromRfcId(rfcId: string): Promise<IEmail | null> {
        const messageId = await this.getMessageIdFromRfcId(rfcId);

        if (!messageId)
            return null;

        return this.getMessage(messageId);
    }

    private async getMessageIdFromRfcId(rfcId: string): Promise<string | null> {
        await this.ensureAuth();
        const response = await this.gmail.users.messages.list({ userId: 'me', q: `rfc822msgid:${rfcId}` });
        const responseMessages = response.data.messages;

        if (!responseMessages)
            return null;
        const message = responseMessages[0];
        if (!message)
            return null;
        return message.id ?? null;
    }

    private async ensureAuth() {
        const authenticated = await this.authenticated;
        if (!authenticated)
            throw new Error("Gmail account not authenticated");
    }
}