import client from '$db/client';
import type { Prisma } from '@prisma/client';

export type salesRepSelect = Prisma.SalesRepArgs;

export class SalesRep {
	public async read(args: salesRepSelect | null = null) {
		return await client.salesRep.findMany({ ...args });
	}

	public async create(args: Prisma.SalesRepCreateArgs) {
		return await client.salesRep.create({ ...args });
	}
}
