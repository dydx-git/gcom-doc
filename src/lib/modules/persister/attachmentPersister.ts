import type { IAttachment, IEmail } from "gmail-api-parse-message-ts";
import { FilePersister } from "./filePersister";
import { compress } from "lzutf8";
import type { Gmailer } from "../gmail/gmail";

export class AttachmentPersister extends FilePersister {
    constructor(folderPath: string) {
        super(folderPath);
    }

    public async saveAttachment(attachment: IAttachment, messageId: string): Promise<void> {
        if (!attachment.data)
            throw new Error(`Attachment ${attachment.attachmentId} has no data`);

        const path = `${this.folderPath}/${messageId}`;
        const compressedFilename = compress(attachment.attachmentId);
        await this.save(compressedFilename, attachment.data);
    }

    public async saveAttachments(attachments: IAttachment[], messageId: string): Promise<void> {
        await Promise.all(attachments.map(attachment => this.saveAttachment(attachment, messageId)));
    }

    public async readAttachment(attachmentId: string): Promise<string> {
        const compressedFilename = compress(attachmentId);
        return this.read(compressedFilename);
    }

    public async readAttachments(attachmentIds: string[]): Promise<Record<string, string>[]> {
        const compressedFilenames = attachmentIds.map(filename => compress(filename));
        const attachments = await Promise.all(compressedFilenames.map(filename => this.read(filename)));
        return attachments.map((attachment, index) => ({ filename: attachmentIds[index], data: attachment }));
    }

    public async readAttachmentOrDownload(message: IEmail, gmailClient: Gmailer) {
        const attachmentIds = message.attachments.map(attachment => attachment.attachmentId);
        const localAttachments = await this.readAttachments(attachmentIds);

        const missingAttachments = message.attachments.filter(attachment => !localAttachments.find(localAttachment => localAttachment.filename === attachment.attachmentId));
    }

    // public async getAttachment(attachmentId: string, messageId: string): Promise<IAttachment> {
    //     const attachment = await this.readAttachment(attachmentId);
    //     return {
    //         attachmentId,
    //         data: attachment
    //     };
    // }
}