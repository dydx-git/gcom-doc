import type { EmailType, PhoneType } from '@prisma/client';
import { JobStatus } from '@prisma/client';

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

export const OrderStatus = {
	...JobStatus,
	OVERDUE: 'OVERDUE'
};

export type OrderDataTable = {
	id: string;
	name: string;
	price: string;
	client: string;
	clientId: string;
	vendor: string;
	companyName: string;
	vendorId: number;
	date: string;
	status: OrderStatus;
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
