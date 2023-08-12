import { GmailMsgSchema, JobOptionalDefaultsSchema, PurchaseOrderOptionalDefaultsSchema } from '$lib/prisma/zod';
import { JobStatus, type Job, type PurchaseOrder, EmailDirection, JobType } from '@prisma/client';
import { z } from 'zod';
import { withDefaults } from "../common/functions/core";
import { fileInfoSchema } from '../common/interfaces/file';
import type { Attachment } from '../gmail/meta';
import { Company } from '../company/meta';

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
	type: JobType;
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type JobsWithVendorAndClient = (PurchaseOrder & {
	jobs: JobWithVendorInfo[];
	client: {
		id: string;
		name: string;
		companyName: string;
		salesRep: {
			name: string;
		};
	};
})[];

export type JobWithVendorInfo = Job & {
	vendor: {
		name: string;
	};
};

export type OrderEmailBody = {
	subjectAddendum?: string;
	body: string;
	attachments: Attachment[];
}

const jobSchema = JobOptionalDefaultsSchema.omit({ price: true, updatedAt: true }).extend({
	price: z.number()
});
export const createJobSchema = jobSchema.omit({ createdAt: true, id: true });
export type CreateJobSchema = z.infer<typeof createJobSchema>;
const gmailSchema = GmailMsgSchema.omit({ jobId: true });
export type GmailSchema = z.infer<typeof gmailSchema>;
export type CreateOrderSchema = CreateJobSchema & { clientId: string } & GmailSchema;

export const createOrderFormSchema = z.object({
	order: withDefaults(createJobSchema, { status: JobStatus.PENDING, type: JobType.JOB, vendorId: undefined }),
	po: withDefaults(PurchaseOrderOptionalDefaultsSchema.pick({ clientId: true }), { clientId: undefined }),
	gmail: withDefaults(gmailSchema.extend({
		attachments: z.array(fileInfoSchema),
		subjectAddendum: z.string().optional(),
		body: z.string(),
		companyId: z.number()
	}), { direction: EmailDirection.BACKWARD })
});
export type CreateOrderFormSchema = z.infer<typeof createOrderFormSchema>;

export const editOrderFormSchema = z.object({
	order: jobSchema.omit({ purchaseOrderId: true }).extend({ createdAt: z.string().datetime() }),
	po: PurchaseOrderOptionalDefaultsSchema.pick({ clientId: true }),
});
export type EditOrderFormSchema = z.infer<typeof editOrderFormSchema>;