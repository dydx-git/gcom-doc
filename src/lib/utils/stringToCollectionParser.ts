export abstract class StringToCollectionParser {
	static parse<T>(str: string): T[] {
		// regex to remove everything between ( and )
		const collection = str
			.trim()
			.replace(/\(.*?\)/g, '')
			.split('/');
		return collection.filter((item) => item !== '') as T[];
	}
}
