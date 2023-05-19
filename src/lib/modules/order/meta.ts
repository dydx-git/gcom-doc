import { GmailMsgSchema, JobOptionalDefaultsSchema, PurchaseOrderOptionalDefaultsSchema } from '$lib/zod-prisma';
import { JobStatus, type Job, type PurchaseOrder, EmailDirection, JobType } from '@prisma/client';
import { z } from 'zod';
import { withDefaults } from "../common/functions/core";
import { fileInfoSchema } from '../common/interfaces/file';
import type { Attachment } from '../gmail/meta';

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
	subjectAddendum: string;
	body: string;
	attachments: Attachment[];
}

export const jobSchema = JobOptionalDefaultsSchema.omit({ id: true, price: true, createdAt: true, updatedAt: true }).extend({
	price: z.number()
});
export type JobSchema = z.infer<typeof jobSchema>;
const createJobSchema = jobSchema.omit({ purchaseOrderId: true });
export type CreateJobSchema = z.infer<typeof createJobSchema>;
const gmailSchema = GmailMsgSchema.omit({ jobId: true });
export type GmailSchema = z.infer<typeof gmailSchema>;
export type CreateOrderSchema = CreateJobSchema & { clientId: string } & GmailSchema;

export const schema = z.object({
	order: withDefaults(jobSchema, { status: JobStatus.PENDING, type: JobType.JOB }),
	po: PurchaseOrderOptionalDefaultsSchema.pick({ clientId: true }),
	gmail: withDefaults(gmailSchema.extend({
		attachments: z.array(fileInfoSchema),
		subjectAddendum: z.string().optional(),
		body: z.string()
	}), { direction: EmailDirection.BACKWARD })
});
export type OrderSchema = z.infer<typeof schema>;