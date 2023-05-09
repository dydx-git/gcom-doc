import type { IAttachment, IEmail } from "gmail-api-parse-message-ts";
import { FilePersister } from "./filePersister";
import { compress } from "lzutf8";
// import mime from "mime-types";
import type { Gmailer } from "../gmail/gmail";
import type { Attachment } from "../gmail/meta";

export class AttachmentPersister extends FilePersister {
    public fileNameSeparator = '###';

    constructor(folderPath: string = '/attachments') {
        super(folderPath);
    }

    public async saveAttachment(attachment: IAttachment, messageId: string): Promise<void> {
        if (!attachment.data)
            throw new Error(`Attachment ${attachment.attachmentId} has no data`);

        const filePath = await this.getFilePath(attachment.attachmentId, messageId);
        await this.save(filePath, attachment.data);
    }

    public async saveAttachments(attachments: IAttachment[], messageId: string): Promise<void> {
        await Promise.all(attachments.map(attachment => this.saveAttachment(attachment, messageId)));
    }

    public async readAttachmentData(attachmentId: string): Promise<string> {
        const compressedFilename = compress(attachmentId);
        return this.read(compressedFilename);
    }

    public async readAttachmentsData(attachmentIds: string[]): Promise<AttachmentData[]> {
        return Promise.all(attachmentIds.map(async attachmentId => {
            const data = await this.readAttachmentData(attachmentId);
            return {
                id: attachmentId,
                data
            };
        }));
    }

    public async readAttachmentOrDownload(message: IEmail, gmailClient: Gmailer) {
        const attachmentIds = message.attachments.map(attachment => attachment.attachmentId);
        const localAttachments = await this.readAttachmentsData(attachmentIds);

        const missingAttachments = message.attachments.filter(attachment => !localAttachments.find(localAttachment => localAttachment.id === attachment.attachmentId));
        const missingAttachmentsData = await Promise.all(missingAttachments.map(async attachment => {
            const data = await gmailClient.getAttachment(attachment.attachmentId, message.id);
            console.log(data);

            return {
                id: attachment.attachmentId,
                data
            };
        }));

        const attachments = [...localAttachments, ...missingAttachmentsData];
        return attachments;
    }

    // private async getAttachmentObjects(attachmentIdsWithData: AttachmentData[]): Promise<Attachment[]> {
    //     return Promise.all(attachmentIdsWithData.map(async attachment => {
    //         const mimeType = mime.lookup(attachment.id);
    //         if (!mimeType)
    //             throw new Error(`Mime type not found for attachment ${attachment.id}`);

    //         return {
    //             filename: attachment.id,
    //             mimeType,
    //             size: attachment.data.length,
    //             data: attachment.data
    //         };
    //     }));
    // }

    private async getFilePath(attachmentId: string, messageId: string): Promise<string> {
        const compressedId = compress(attachmentId);
        return `${this.folderPath}/${messageId}/${compressedId}${this.fileNameSeparator}${attachmentId}`;
    }

    private async getAttachmentIdAndNameFromFilename(fileNameOnDisk: string): Promise<{ attachmentId: string, filename: string }> {
        const split = fileNameOnDisk.split(this.fileNameSeparator);
        if (split.length !== 2)
            throw new Error(`Invalid filename ${fileNameOnDisk}`);

        const attachmentId = split[1];

        return {
            attachmentId,
            filename: fileNameOnDisk
        };
    }

    // public async getAttachment(attachmentId: string, messageId: string): Promise<IAttachment> {
    //     const attachment = await this.readAttachment(attachmentId);
    //     return {
    //         attachmentId,
    //         data: attachment
    //     };
    // }
}

type AttachmentData = {
    id: string;
    data: string;
}