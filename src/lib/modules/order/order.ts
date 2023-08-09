import prisma from '$db/client';
import { JobStatus, Prisma } from '@prisma/client';
import { type JobsWithVendorAndClient, type OrderDataTable, OrderStatus, type CreateOrderSchema, createJobSchema } from './meta';
import hash from 'object-hash';
import type { IHashId } from '../common/interfaces/core';

export class Jobs implements IHashId {
	private include = {
		jobs: {
			include: {
				vendor: {
					select: {
						name: true
					}
				}
			}
		},
		client: {
			select: {
				id: true,
				name: true,
				companyName: true,
				salesRep: {
					select: {
						name: true
					}
				}
			}
		}
	};

	public async read(dateUntil: Date): Promise<JobsWithVendorAndClient> {
		return await prisma.purchaseOrder.findMany({
			where: {
				jobs: {
					every: {
						createdAt: {
							gte: dateUntil
						}
					}
				}
			},
			include: this.include
		});
	}

	public async readById(id: string) {
		return await prisma.job.findUnique({
			where: {
				id
			}
		});
	}

	public async update(id: string, data: Prisma.JobUpdateInput) {
		return await prisma.job.update({
			where: {
				id
			},
			data
		});
	}


	public async readForDataTable(dateUntil: Date): Promise<OrderDataTable[]> {
		const jobs = await this.read(dateUntil);
		const result: OrderDataTable[] = [];
		const aDayAgo = new Date();
		aDayAgo.setDate(aDayAgo.getDate() - 1);

		jobs.forEach((job) => {
			const { client, jobs } = job;
			jobs.forEach((job) => {
				result.push({
					id: job.id,
					name: job.name,
					price: job.price.toString(),
					client: client.name,
					companyName: client.companyName,
					clientId: client.id,
					vendor: job.vendor.name,
					vendorId: job.vendorId,
					date: job.createdAt.toString(),
					type: job.type,
					status: job.createdAt > aDayAgo && job.status == JobStatus.PENDING
						? OrderStatus.OVERDUE
						: job.status
				});
			});
		});

		return result;
	}

	public async create(job: CreateOrderSchema) {
		const createdPurchaseOrder = await prisma.purchaseOrder.create({
			data: {
				clientId: job.clientId
			}
		});

		const id = this.hash(job);
		const data: Prisma.JobUncheckedCreateInput = { id, ...job, purchaseOrderId: createdPurchaseOrder.id };

		const createdJob = await prisma.job.create({
			data: { id, ...createJobSchema.parse(data) }
		});

		await prisma.purchaseOrder.update({
			where: {
				id: createdPurchaseOrder.id
			},
			data: {
				primaryJobId: createdJob.id,
				jobs: {
					connect: {
						id: createdJob.id
					}
				}
			}
		});

		return createdJob;
	}


	public hash(obj: CreateOrderSchema): string {
		const { clientId, vendorId, name, price, status, inboxMsgId } = obj;

		return hash({
			clientId,
			vendorId,
			name,
			price,
			status,
			inboxMsgId
		}, { algorithm: 'md5' });
	}
}
