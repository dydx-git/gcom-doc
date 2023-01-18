import client from '$db/client';
import { Prisma, type job, type purchase_order } from '@prisma/client';

const jobInclude = Prisma.validator<Prisma.purchase_orderInclude>()({
	job: true
});

export type Orders = Prisma.purchase_orderGetPayload<typeof jobInclude>;

export class PurchaseOrder implements purchase_order {
	id: number;
	job_id: string;

	constructor(pos: PurchaseOrder) {
		this.id = pos[0].id;
	}
}

export class Jobs extends Array<job> {
	constructor() {
		super();
	}
}
