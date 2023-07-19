import type { IEmail } from 'gmail-api-parse-message-ts';
import { z } from 'zod';
import { Clients } from "$lib/modules/client/client";
import { Email } from '$lib/modules/common/models/email';
import type { GenericFileInfo } from '../common/interfaces/file';

export const rfcEmailResponse = z.object({
    messageId: z.string(),
    threadId: z.string(),
    companyId: z.number(),
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
    private data: IEmail & { companyId: number };

    constructor(data: IEmail & { companyId: number }) {
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
            preferredEmail: client?.id ? fromEmail : null,
            companyId: this.data.companyId,
            attachments: this.data.attachments.map((attachment): GenericFileInfo => ({
                filename: attachment.filename,
                mimeType: attachment.mimeType,
                size: attachment.size
            }))
        };

        return rfcEmailResponse.parse(transformed);
    }
}
