import type { PhoneFormData, EmailFormData } from '$lib/models/client-form';
import type { PayMethod } from '@prisma/client';

export interface ClientFormData {
	id: string | null;
	name: string;
	companyName: string;
	phones: PhoneFormData[];
	emails: EmailFormData[];
	company: number;
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

export interface OrderFormData {
	id: string | null;
	name: string;
	price: string;
	client: string;
	clientId: string;
	vendor: string;
	vendorId: number;
	date: string;
}
