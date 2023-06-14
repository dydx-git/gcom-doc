import type { Company } from "@prisma/client";
import { GmailAuth } from "./oauth";
import { google, gmail_v1 } from 'googleapis'
import { ParseGmailApi, type IEmail } from 'gmail-api-parse-message-ts';
import MailComposer from 'nodemailer/lib/mail-composer';
import type { Attachment } from "./meta";
import { Email } from "../common/models/email";
import { dev } from "$app/environment";
import { emailSendLoggable } from "./emailStatusTracker";

export class Gmailer {
    private static _instances: { [id: number]: Gmailer } = {} as any;
    private _company: Company;
    private gmail = google.gmail('v1')
    private static parser = new ParseGmailApi();

    public static async getInstance(company: Company) {
        const id = company.id;
        console.log(Gmailer._instances);

        if (!Gmailer._instances[id]) {
            console.warn("Gmailer instance not found, creating new instance");
            await Gmailer.ensureAuth(id);
            Gmailer._instances[id] = new Gmailer(company);
        }

        return Gmailer._instances[id];
    }

    private constructor(company: Company) {
        this._company = company;
        const id = company.id;
    }

    public async getMessages(params: gmail_v1.Params$Resource$Users$Messages$List): Promise<IEmail[]> {
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
        const response = await this.gmail.users.messages.get({ id: messageId, userId: 'me', fields })
        const message = Gmailer.parser.parseMessage(response.data)

        return message
    }

    public async getAttachment(attachmentId: string, messageId: string): Promise<gmail_v1.Schema$MessagePartBody> {
        const response = await this.gmail.users.messages.attachments.get({
            id: attachmentId, messageId, userId: 'me'
        })

        const attachment = response.data
        return attachment;
    }

    public async getThread(messageId: string): Promise<IEmail[]> {
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

    public async sendMessage(to: Email | Email[], subject: string, body = '', attachments: Attachment[] = []) {
        return Gmailer.sendMessage(this, to, subject, body, attachments);
    }

    @emailSendLoggable()
    public static async sendMessage(mailer: Gmailer, to: Email | Email[], subject: string, body = '', attachments: Attachment[] = []) {
        const buildMessage = () => new Promise<string>((resolve, reject) => {
            if (dev)
                to = new Email('muhammadtahatron@gmail.com', 'Muhammad Taha');

            const message = new MailComposer({
                to,
                subject,
                html: body,
                attachments: attachments.map(attachment => ({
                    filename: attachment.filename,
                    contentType: attachment.mimeType,
                    contentDisposition: 'attachment',
                    content: attachment.data,
                    encoding: 'base64'
                })),
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

        const response = await mailer.gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });
        return Gmailer.parser.parseMessage(response.data);
    }

    public async getMessageFromSearch(searchString: string): Promise<IEmail | null> {
        const messageId = await this.getMessageIdFromSearch(searchString);

        if (!messageId)
            return null;

        return this.getMessage(messageId);
    }

    public async getAttachments(messageId: string): Promise<gmail_v1.Schema$MessagePartBody[]>;
    public async getAttachments(message: IEmail): Promise<gmail_v1.Schema$MessagePartBody[]>;
    public async getAttachments(messageOrId: string | IEmail): Promise<gmail_v1.Schema$MessagePartBody[]> {
        if (typeof messageOrId === 'string')
            return this.getAttachmentsFromMessageId(messageOrId);

        return this.getAttachmentsFromMessage(messageOrId);
    }

    private async getAttachmentsFromMessageId(messageId: string): Promise<Attachment[]> {
        const message = await this.getMessage(messageId, 'id,threadId,labelIds,payload,snippet');
        return this.getAttachmentsFromMessage(message);
    }

    private async getAttachmentsFromMessage(message: IEmail): Promise<Attachment[]> {
        const attachments = message.attachments ?? [];
        const attachmentsWithData = attachments.map(async (a): Promise<Attachment> => {
            if (a.data)
                return {
                    ...a,
                    data: a.data
                }

            const data = (await this.getAttachment(a.attachmentId, message.id)).data;
            if (!data)
                throw new Error("Attachment data not found");

            return {
                ...a,
                data: data
            }
        });

        return Promise.all(attachmentsWithData);
    }


    private async getMessageIdFromSearch(searchString: string): Promise<string | null> {
        const response = await this.gmail.users.messages.list({ userId: 'me', q: searchString });

        const responseMessages = response.data.messages;

        if (!responseMessages || responseMessages.length === 0 || !responseMessages[0].threadId)
            return null;

        const message = this.getLastMessage(responseMessages[0].threadId, responseMessages);
        if (!message)
            return null;

        return message.id ?? null;
    }

    private getLastMessage(threadId: string, messageIdThreadIdPair: gmail_v1.Schema$Message[]) {
        return messageIdThreadIdPair.reverse().find(m => m.threadId === threadId);
    }

    private static async ensureAuth(id: number) {
        const gmailAuth = new GmailAuth(id);
        const authenticated = await gmailAuth.authorize();
        if (!authenticated)
            throw new Error("Gmail account not authenticated");
    }
}