import { Prisma } from '@prisma/client';

const jobAndClientInclude = Prisma.validator<Prisma.PurchaseOrderInclude>()({
	jobs: true,
	client: true
});

export type Order = Prisma.PurchaseOrderGetPayload<{
	include: typeof jobAndClientInclude;
}>;
