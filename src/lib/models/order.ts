import client from '$db/client';
import type { Job, PurchaseOrder } from '@prisma/client';

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

export class Jobs {
	public async read(dateUntil: Date): Promise<JobsWithVendorAndClient> {
		return await client.purchaseOrder.findMany({
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
}
