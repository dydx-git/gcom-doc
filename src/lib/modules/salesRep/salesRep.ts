import client from '$db/client';
import type { Prisma } from '@prisma/client';

export class SalesRep {
    public async read(args: Prisma.SalesRepArgs | null = null) {
        return await client.salesRep.findMany({ ...args });
    }

    public async create(args: Prisma.SalesRepUncheckedCreateInput) {
        return await client.salesRep.create({ data: args });
    }
}
