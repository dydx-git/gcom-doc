import * as fs from 'fs-extra';
import { DataPersister } from "./dataPersister";
import type { FileSchema } from '../common/interfaces/file';

export class FilePersister extends DataPersister {
    constructor(folderPath: string) {
        super(folderPath);
    }
}