import { GmailMsgSchema, JobOptionalDefaultsSchema } from '$lib/zod-prisma';
import { JobStatus, type Job, type PurchaseOrder } from '@prisma/client';
import { z } from 'zod';
import { withDefaults } from "../common/functions/core";

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

const orderSchema = JobOptionalDefaultsSchema.omit({ id: true, price: true, jobId: true }).extend({
	price: z.number()
});
export type OrderSchema = z.infer<typeof orderSchema>;
const gmailSchema = GmailMsgSchema.omit({ jobId: true });
export type GmailSchema = z.infer<typeof gmailSchema>;
const attachmentSchema = z.object({
	id: z.string(),
	name: z.string()
});

export const schema = z.object({
	order: withDefaults(orderSchema, { status: JobStatus.PENDING }),
	gmail: gmailSchema,
	attachments: z.array(attachmentSchema)
});
export type JobSchema = z.infer<typeof schema>;