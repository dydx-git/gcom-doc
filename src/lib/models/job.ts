import { Prisma } from '@prisma/client';

const jobInclude = Prisma.validator<Prisma.PurchaseOrderInclude>()({
	jobs: true
});

const clientInclude = Prisma.validator<Prisma.JobInclude>()({});

export type Order = Prisma.PurchaseOrderGetPayload<{
	include: typeof jobInclude;
}>;
