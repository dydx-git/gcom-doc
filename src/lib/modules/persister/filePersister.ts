import type { FileSchema } from "../gmail/meta";
import * as fs from 'fs-extra';
import { DataPersister } from "./dataPersister";

export class FilePersister extends DataPersister {
    constructor(folderPath: string) {
        super(folderPath);
    }

    public async saveFile(file: FileSchema): Promise<void> {
        const path = `${this.folderPath}/${file.filename}`;
        const buffer = Buffer.from(file.data, 'base64');
        const streamWriter = new 
    }
}