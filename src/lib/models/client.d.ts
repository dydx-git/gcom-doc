import type { Company } from './company';
import type { IEntity } from './core';
import type { SalesRep } from './employee';

export interface Client extends IEntity {
	invoiceEmail: string;
	phone: string;
	phone2: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;
	notes: string;
	isArchived: boolean;
	createdAt: string;
	employee: SalesRep;
	company: Company;
}
