import type { GmailRawId } from '$lib/models/gmail';
import type { DesignStatus, IOrder, OrderStatus, IRevision, IDesign } from '$lib/models/order';
import type { Prisma } from '@prisma/client';

class Order implements IOrder {
	status: OrderStatus | DesignStatus;
	bwdReceivedThreadId: GmailRawId;
	bwdReceivedMsgId: GmailRawId;
	bwdSentMsgId: GmailRawId;
	fwdSentThreadId: GmailRawId;
	revision: IRevision;
	design: IDesign;
	id: string | number;
	createdAt: Date;

	constructor(pDesign: Prisma.designSelect) {
		this.status = pDesign.status;
		this.bwdReceivedThreadId = pDesign.bwdReceivedThreadId;
		this.bwdReceivedMsgId = pDesign.bwdReceivedMsgId;
		this.bwdSentMsgId = pDesign.bwdSentMsgId;
		this.fwdSentThreadId = pDesign.fwdSentThreadId;
		this.revision = pDesign.revision;
		this.design = pDesign.design;
		this.id = pDesign.id;
		this.createdAt = pDesign.createdAt;
	}
}
