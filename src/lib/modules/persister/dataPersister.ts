
import * as fs from 'fs-extra';


export abstract class DataPersister {
    protected folderPath: string;

    constructor(folderPath: string) {
        this.folderPath = folderPath;
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath);
    }

    public async save(filePath: string, data: string): Promise<void> {
        const splits = filePath.split('/');
        const folder = splits.pop();
        const filename = splits.pop();
        const path = `${this.folderPath}/${folder}`;
        if (!fs.existsSync(path))
            await fs.mkdirp(path);

        await fs.writeFile(`${path}/${filename}`, data);
    }

    public async read(filename: string): Promise<string | null> {
        const path = `${this.folderPath}/${filename}`;
        try {
            const data = await fs.readFile(path, 'utf8');
            return data;
        } catch (error) {
            return null;
        }
    }

    public async readFolderFiles(folderToRead: string) {
        try {
            const folderFiles: string[] = await fs.readdir(`${this.folderPath}/${folderToRead}`);
            return folderFiles;
        } catch (error) {
            return null;
        }
    }
}