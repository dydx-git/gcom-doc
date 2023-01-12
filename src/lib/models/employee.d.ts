import type { Company } from './company';

export interface SalesRep {
	id: number;
	firstName: string;
	lastName: string;
	company: Company;
	username: string;
	mentor: SalesRep;
}
