import type { IAttachment, IEmail } from "gmail-api-parse-message-ts";
import { FilePersister } from "./filePersister";
import hash from "shorthash2";
// import mime from "mime-types";
import type { Gmailer } from "../gmail/gmail";
import type { Attachment } from "../gmail/meta";

export class AttachmentPersister extends FilePersister {
    public fileNameSeparator = '###';

    constructor(folderPath: string = './.att') {
        super(folderPath);
    }

    public async saveAttachment(attachment: IAttachment, messageId: string): Promise<void> {
        if (!attachment.data)
            return;

        const filePath = await this.getFilePath(attachment.attachmentId, messageId);
        await this.save(`${filePath}${attachment.filename}`, attachment.data);
    }

    public async saveAttachments(attachments: IAttachment[], messageId: string): Promise<void> {
        await Promise.all(attachments.map(attachment => this.saveAttachment(attachment, messageId)));
    }

    public async readAttachmentData(attachmentId: string, messageId: string): Promise<string | null> {
        const filePath = await this.getFilePath(attachmentId, messageId);

        return this.read(filePath);
    }

    public async readAttachmentsData(attachmentIds: string[], messageId: string): Promise<AttachmentData[]> {
        const attachments = await Promise.all(attachmentIds.map(async attachmentId => {
            const data = await this.readAttachmentData(attachmentId, messageId);
            if (!data)
                return null;
            return {
                id: attachmentId,
                data
            };
        }));

        return attachments.flatMap(f => !!f ? [f] : []);
    }

    public async readAttachmentOrDownload(message: IEmail, gmailClient: Gmailer): Promise<AttachmentData[]> {
        const attachmentIds = message.attachments.map(attachment => attachment.attachmentId);
        const localAttachments = await this.readAttachmentsData(attachmentIds, message.id);

        const missingAttachments = message.attachments.filter(attachment => !localAttachments.find(localAttachment => localAttachment.id === attachment.attachmentId));
        const missingAttachmentsData = await Promise.all(missingAttachments.map(async attachment => {
            const data = (await gmailClient.getAttachment(attachment.attachmentId, message.id)).data;
            if (!data)
                return null;
            this.saveAttachment({ ...attachment, data }, message.id);
            return {
                id: attachment.attachmentId,
                data
            };
        }));

        const attachments = [...localAttachments, ...missingAttachmentsData.flatMap(f => !!f ? [f] : [])];
        return attachments;
    }

    public override async read(partialFilePath: string): Promise<string | null> {
        const splits = partialFilePath.split('/');
        const folder = splits[0];
        const attachmentId = splits[1].replace(this.fileNameSeparator, '');
        let folderFiles = await this.readFolderFiles(folder);
        if (!folderFiles)
            return null;

        const attachmentFilename = folderFiles.find(file => file.includes(attachmentId));
        if (!attachmentFilename)
            return null;

        return super.read(`${folder}/${attachmentFilename}`);
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
        const compressedId = hash(attachmentId);

        return `${messageId}/${compressedId}${this.fileNameSeparator}`;
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