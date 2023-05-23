import type { IAttachment, IEmail } from "gmail-api-parse-message-ts";
import { FilePersister } from "./filePersister";
import hash from "@sindresorhus/string-hash";
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

        const filePath = await this.getFilePath(AttachmentPersister.getAttachmentPrefix(attachment), messageId);
        const filename = attachment.filename.split('.').slice(0, -1).join('.');
        const extension = mime.extension(attachment.mimeType);

        // base64 decode
        const data = Buffer.from(attachment.data, 'base64');
        await this.save(filePath + filename + "." + extension, data);
    }

    public async saveAttachments(attachments: IAttachment[], messageId: string): Promise<void> {
        await Promise.all(attachments.map(attachment => this.saveAttachment(attachment, messageId)));
    }

    public async readAttachmentData(attachmentPrefix: string, messageId: string): Promise<Attachment | null> {
        const filePath = await this.getFilePath(attachmentPrefix, messageId);

        const fileData = await this.read(filePath);
        if (!fileData)
            return null;

        const { filename, data } = fileData;

        return {
            filename,
            mimeType: mime.lookup(filename).toString(),
            data,
            size: data.length
        }
    }

    public async readAttachmentsData(attachmentPrefixs: string[], messageId: string): Promise<Attachment[]> {
        const attachments = await Promise.all(attachmentPrefixs.map(async attachmentPrefix => {
            const data = await this.readAttachmentData(attachmentPrefix, messageId);

            if (!data)
                return null;
            return data;
        }));

        return attachments.flatMap(f => !!f ? [f] : []);
    }

    public async readAttachmentOrDownload(messageOrId: string, gmailClient: Gmailer): Promise<Attachment[]>
    public async readAttachmentOrDownload(messageOrId: IEmail | string, gmailClient: Gmailer): Promise<Attachment[]> {
        if (typeof messageOrId === 'string')
            messageOrId = await gmailClient.getMessage(messageOrId);

        const attachments = AttachmentPersister.getAttachments(messageOrId);
        const attachmentPrefixs = attachments.map(attachment => AttachmentPersister.getAttachmentPrefix(attachment));
        const localAttachments = await this.readAttachmentsData(attachmentPrefixs, messageOrId.id);

        const missingAttachments = attachments.filter(attachment => !localAttachments.find(localAttachment => AttachmentPersister.getAttachmentPrefix(localAttachment) === AttachmentPersister.getAttachmentPrefix(attachment)));
        if (missingAttachments.length === 0)
            return localAttachments;

        const missingAttachmentsData = await this.downloadAttachments(messageOrId, missingAttachments.map(attachment => attachment.attachmentId), gmailClient);

        return [...localAttachments, ...missingAttachmentsData.flatMap(f => !!f ? [f] : [])];
    }

    public async downloadAttachments(message: IEmail, attachmentIdsToDownload: string[] | true, gmailClient: Gmailer): Promise<Attachment[]> {
        if (attachmentIdsToDownload === true)
            attachmentIdsToDownload = AttachmentPersister.getAttachments(message).map(attachment => attachment.attachmentId);

        console.warn("⚠ Downloading attachments")
        console.warn(attachmentIdsToDownload);

        const attachments = await Promise.all(attachmentIdsToDownload.map(async attachmentId => {
            const data = (await gmailClient.getAttachment(attachmentId, message.id)).data;
            if (!data)
                return null;

            const attachment = AttachmentPersister.getAttachments(message).find(attachment => attachment.attachmentId === attachmentId);
            if (!attachment)
                return null;

            this.saveAttachment({ ...attachment, data }, message.id);

            return { ...attachment, data };
        }));

        return attachments.flatMap(f => !!f ? [f] : []);
    }

    private static getAttachments(message: IEmail) {
        return message.attachments.concat(message.inline ?? []);
    }

    public async read(partialFilePath: string) {
        const splits = partialFilePath.split('/');
        const folder = splits[0];
        const attachmentPrefix = splits[1].replace(this.fileNameSeparator, '');
        let folderFiles = await this.readFolderFiles(folder);
        if (!folderFiles)
            return null;

        const attachmentFilename = folderFiles.find(file => file.includes(attachmentPrefix));
        if (!attachmentFilename)
            return null;

        const data = await super.readMultipleFiles([`${folder}/${attachmentFilename}`]);

        if (!data)
            return null;

        return data[0];
    }

    private async getFilePath(attachmentPrefix: string, messageId: string): Promise<string> {
        const compressedId = hash(attachmentPrefix);

        return `${messageId}/${compressedId}${this.fileNameSeparator}`;
    }

    private static getAttachmentPrefix(attachment: IAttachment | Attachment) {
        return `${attachment.mimeType}${attachment.size}`;
    }
}