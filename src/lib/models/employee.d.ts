import type { Company } from './company';
import type { IEntity } from './core';

export interface SalesRep extends IEntity {
	company: Company;
	username: string;
	mentor: SalesRep;
}
