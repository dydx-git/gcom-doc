export interface IDbCRUD {
	create(...args: any[]): Promise<object>;
	read(args: object): Promise<object>;
	update(id: string | number, ...args: any[]): Promise<object>;
	delete(id: string | number): Promise<object>;
}
