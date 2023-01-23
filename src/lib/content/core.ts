import type { Client, Currency, EmailType, PayMethod, PhoneType } from '@prisma/client';
import type { Error } from 'src/app';

export enum FormSubmitType {
	AddNew,
	Edit
}

export type FormSubmitResult = {
	success: boolean;
	errors: string[];
};

export type PhoneFormData = {
	phone: string;
	type: PhoneType;
	description: string;
};

export type EmailFormData = {
	email: string;
	type: EmailType;
	description: string;
};

export interface ClientFormData {
	id: string | null;
	name: string;
	companyName: string;
	phones: PhoneFormData[];
	emails: EmailFormData[];
	company: Company;
	paymentMethod: PayMethod;
	currency: Currency;
	addTransactionCharge: boolean;
	address: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	notes: string;
}

export enum Company {
	BuffaloWebWork = 2,
	ItecDesigns = 1,
	ThreadTapes = 3
}

export const CompanyLabel: { [key in Company]: string } = {
	[Company.BuffaloWebWork]: 'Buffalo Web Work',
	[Company.ItecDesigns]: 'Itec Designs',
	[Company.ThreadTapes]: 'Thread Tapes'
};
