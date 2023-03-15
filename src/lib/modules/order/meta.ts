import { JobStatus, type Job, type PurchaseOrder } from '@prisma/client';

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

export type JobsWithVendorAndClient = (PurchaseOrder & {
	jobs: (Job & {
		vendor: {
			id: number;
			name: string;
		};
	})[];
	client: {
		id: string;
		name: string;
		companyName: string;
		salesRep: {
			name: string;
		};
	};
})[];
