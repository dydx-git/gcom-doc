import prisma from '$db/client';
import { JobStatus } from '@prisma/client';
import { type JobsWithVendorAndClient, type OrderDataTable, OrderStatus } from './meta';

export class Jobs {
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
			include: {
				jobs: {
					include: {
						vendor: {
							select: {
								id: true,
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
			}
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
					vendorId: job.vendor.id,
					date: job.createdAt.toString(),
					status: job.createdAt > aDayAgo && job.status == JobStatus.PENDING
						? OrderStatus.OVERDUE
						: job.status
				});
			});
		});

		return result;
	}
}
