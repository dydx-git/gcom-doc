import type { IAttachment, IEmail } from "gmail-api-parse-message-ts";
import { FilePersister } from "./filePersister";
import hash from "shorthash2";
import mime from "mime-types";
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
        const filename = attachment.filename.split('.').slice(0, -1).join('.');
        const extension = mime.extension(attachment.mimeType);

        // base64 decode
        const data = Buffer.from(attachment.data, 'base64');
        await this.save(filePath + filename + "." + extension, data);
    }

    public async saveAttachments(attachments: IAttachment[], messageId: string): Promise<void> {
        await Promise.all(attachments.map(attachment => this.saveAttachment(attachment, messageId)));
    }

    public async readAttachmentData(attachmentId: string, messageId: string): Promise<Attachment | null> {
        const filePath = await this.getFilePath(attachmentId, messageId);

        const fileData = await this.read(filePath);
        if (!fileData)
            return null;

        const { filename, data } = fileData;

        return {
            attachmentId,
            filename,
            mimeType: mime.lookup(filename).toString(),
            data,
            size: data.length
        }
    }

    public async readAttachmentsData(attachmentIds: string[], messageId: string): Promise<Attachment[]> {
        const attachments = await Promise.all(attachmentIds.map(async attachmentId => {
            const data = await this.readAttachmentData(attachmentId, messageId);
            if (!data)
                return null;
            return data;
        }));

        return attachments.flatMap(f => !!f ? [f] : []);
    }

    public async readAttachmentOrDownload(message: string, gmailClient: Gmailer): Promise<Attachment[]>
    public async readAttachmentOrDownload(message: IEmail | string, gmailClient: Gmailer): Promise<Attachment[]> {
        if (typeof message === 'string')
            message = await gmailClient.getMessage(message);

        const attachmentIds = message.attachments.map(attachment => attachment.attachmentId);
        const localAttachments = await this.readAttachmentsData(attachmentIds, message.id);

        const missingAttachments = message.attachments.filter(attachment => !localAttachments.find(localAttachment => localAttachment.attachmentId === attachment.attachmentId));
        if (missingAttachments.length === 0)
            return localAttachments;

        const missingAttachmentsData = await this.downloadAttachments(message, missingAttachments.map(attachment => attachment.attachmentId), gmailClient);

        const attachments = [...localAttachments, ...missingAttachmentsData.flatMap(f => !!f ? [f] : [])];
        return attachments;
    }

    public async downloadAttachments(message: IEmail, attachmentIdsToDownload: string[] | true, gmailClient: Gmailer): Promise<Attachment[]> {
        if (attachmentIdsToDownload === true)
            attachmentIdsToDownload = message.attachments.map(attachment => attachment.attachmentId);

        const attachments = await Promise.all(attachmentIdsToDownload.map(async attachmentId => {
            const data = (await gmailClient.getAttachment(attachmentId, message.id)).data;
            if (!data)
                return null;

            const attachment = message.attachments.find(attachment => attachment.attachmentId === attachmentId);
            if (!attachment)
                return null;

            this.saveAttachment({ ...attachment, data }, message.id);

            return { ...attachment, data };
        }));

        return attachments.flatMap(f => !!f ? [f] : []);
    }

    public async read(partialFilePath: string) {
        const splits = partialFilePath.split('/');
        const folder = splits[0];
        const attachmentId = splits[1].replace(this.fileNameSeparator, '');
        let folderFiles = await this.readFolderFiles(folder);
        if (!folderFiles)
            return null;

        const attachmentFilename = folderFiles.find(file => file.includes(attachmentId));
        if (!attachmentFilename)
            return null;

        const data = await super.readMultipleFiles([`${folder}/${attachmentFilename}`]);
        if (!data)
            return null;

        return data[0];
    }

    private async getFilePath(attachmentId: string, messageId: string): Promise<string> {
        const compressedId = hash(attachmentId);

        return `${messageId}/${compressedId}${this.fileNameSeparator}`;
    }
}