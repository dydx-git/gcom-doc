export interface IDbCRUD {
	read: (args: object | null) => Promise<object>;
	create: (args: object) => Promise<object>;
	update: (args: object) => Promise<object>;
	delete: (args: object) => Promise<object>;
}
