import type { IEmail } from 'gmail-api-parse-message-ts';
import { z } from 'zod';
import { Clients } from "$lib/modules/client/client";
import { Email } from '$lib/modules/common/models/email';

export const rfcEmailResponse = z.object({
    messageId: z.string(),
    threadId: z.string(),
    clientId: z.string().optional(),
    body: z.string(),
    subject: z.string(),
    attachments: z.array(z.object({
        filename: z.string(),
        mimeType: z.string(),
        size: z.number()
    }))
});

export type RfcEmailResponse = z.infer<typeof rfcEmailResponse>;

export class GmailDataTransformer {
    private data: IEmail;

    constructor(data: IEmail) {
        this.data = data;
    }

    public async toRfcEmailResponse(): Promise<RfcEmailResponse> {
        const fromEmail = new Email(this.data.from.email);
        const client = await new Clients().getClient([fromEmail]);

        const transformed = {
            messageId: this.data.id,
            threadId: this.data.threadId,
            body: this.data.textHtml,
            subject: this.data.subject,
            clientId: client?.id,
            attachments: this.data.attachments.map(attachment => ({
                filename: attachment.filename,
                mimeType: attachment.mimeType,
                size: attachment.size
            }))
        };

        return rfcEmailResponse.parse(transformed);
    }
}
