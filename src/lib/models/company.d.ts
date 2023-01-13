import type { IEntity, IHasEmail } from './core';

export interface Company extends IEntity, IHasEmail {
	address: string;
	phone: string;
	website: string;
}
