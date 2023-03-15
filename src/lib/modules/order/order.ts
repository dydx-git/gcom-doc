import prisma from '$db/client';
import type { JobsWithVendorAndClient } from './meta';

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
}
