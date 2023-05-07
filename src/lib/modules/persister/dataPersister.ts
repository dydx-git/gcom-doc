
import * as fs from 'fs-extra';


export abstract class DataPersister {
    protected folderPath: string;

    constructor(folderPath: string) {
        this.folderPath = folderPath;
    }

    public async save(filename: string, data: string): Promise<void> {
        const path = `${this.folderPath}/${filename}`;
        await fs.writeFile(path, data);
    }

    public async read(filename: string): Promise<string> {
        const path = `${this.folderPath}/${filename}`;
        return fs.readFile(path, 'utf8');
    }
}