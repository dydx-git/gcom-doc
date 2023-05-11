
import * as fs from 'fs-extra';


export abstract class DataPersister {
    protected folderPath: string;

    constructor(folderPath: string) {
        this.folderPath = folderPath;
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath);
    }

    public async save(filePath: string, data: string | Buffer): Promise<void> {
        const directories = filePath.split('/').slice(0, -1);
        const filename = filePath.split('/').slice(-1)[0];

        const path = `${this.folderPath}/${directories.join('/')}`;

        if (!fs.existsSync(path))
            fs.mkdirSync(path, { recursive: true });

        await fs.writeFile(`${path}/${filename}`, data);
    }

    public async readFile(filename: string): Promise<string | null> {
        const path = `${this.folderPath}/${filename}`;
        try {
            const data = await fs.readFile(path, 'utf8');
            return data;
        } catch (error) {
            return null;
        }
    }

    public async readMultipleFiles(filenames: string[]) {
        const data = await Promise.all(filenames.map(async filename => {
            const fileData = await this.readFile(filename);
            if (!fileData)
                return null;
            return {
                filename,
                data: fileData
            };
        }));
        return data.flatMap(f => !!f ? [f] : []);
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