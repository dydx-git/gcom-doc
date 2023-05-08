import * as fs from 'fs-extra';
import { DataPersister } from "./dataPersister";
import type { FileSchema } from '../common/interfaces/file';

export class FilePersister extends DataPersister {
    constructor(folderPath: string) {
        super(folderPath);
    }

    public async saveFile(file: FileSchema): Promise<void> {
        const filePath = `${this.folderPath}/${file.filename}`;
        await fs.writeFile(filePath, file.data);
    }
}