import type {
	EmailType,
	PhoneType,
	PayMethod,
	ClientEmail,
	Client,
	ClientAddress,
	ClientPhone
} from '@prisma/client';

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
	description: string | null;
};

export type EmailFormData = {
	email: string;
	type: EmailType;
	description: string | null;
};

// TODO: take company out of here
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

export interface ClientFormData {
	id: string | null;
	name: string;
	companyName: string;
	phones: PhoneFormData[];
	emails: EmailFormData[];
	company: number;
	salesRep: number | null;
	paymentMethod: PayMethod;
	currency: string;
	addTransactionCharge: boolean;
	address: string;
	city: string;
	state: string;
	country: string;
	zip: string;
	notes: string;
}

export type ClientsWithSalesRepAndCompany = (Client & {
	emails: ClientEmail[];
	phones: ClientPhone[];
	clientAddress: ClientAddress | null;
	salesRep: {
		id: number;
		name: string;
	};
	company: {
		id: number;
		name: string;
	};
})[];

export type Address = {
	formattedAddress: string;
	addressLine: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	country: string | null;
};