import type { Company } from './company';
import type { SalesRep } from './employee';

export interface Client {
	id: number;
	name: string;
	orderEmail: string;
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
