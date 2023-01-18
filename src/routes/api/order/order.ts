import type { IClient } from '$lib/models/job';
import type { GmailRawId } from '$lib/models/gmail';
import {
	DesignStatus,
	type IOrder,
	OrderStatus,
	type IRevision,
	type IDesign,
	type JobStatus
} from '$lib/models/order';
import type { IVendor } from '$lib/models/vendor';
import TimeCalculator from '$lib/utils/TimeCalculator';
import DBClient from '$db/client';
import type { PrismaClient } from '@prisma/client';

class Order implements IOrder {
	static readonly overdueHourThreshold = 24;
	static readonly newHourThreshold = 1;
	status: JobStatus;
	bwdReceivedThreadId: GmailRawId;
	bwdReceivedMsgId: GmailRawId;
	bwdSentMsgId: GmailRawId;
	fwdSentThreadId: GmailRawId;
	revision: IRevision;
	design: IDesign;
	id: string | number;
	createdAt: Date;
	client: IClient;
	vendor: IVendor;

	constructor(pDesign: Prisma.designSelect) {
		this.status = inferStatus(
			<DesignStatus>pDesign.status,
			<DesignStatus[]>pDesign.revision?.map((r) => r.status),
			pDesign.date
		);
	}

	inferStatus(
		designStatus: DesignStatus,
		revisionsStatus: DesignStatus[],
		createdAt: Date
	): JobStatus {
		const orderStatus = inferDesignCompletionStatus(designStatus, revisionsStatus);
		if (orderStatus == DesignStatus.Complete) return orderStatus;

		const test = await DBClient.design.findFirst();
		test.

		return inferOrderPendingStatusRelativeToTime(createdAt);

		function inferDesignCompletionStatus(
			designStatus: DesignStatus,
			revisionsStatus: DesignStatus[]
		): JobStatus {
			if (revisionsStatus.includes(DesignStatus.Pending)) return OrderStatus.PendingRevision;

			return designStatus;
		}

		function inferOrderPendingStatusRelativeToTime(createdAt: Date): JobStatus {
			if (Order.isOverdue(createdAt)) return OrderStatus.Overdue;
			if (Order.isNew(createdAt)) return OrderStatus.New;

			return DesignStatus.Pending;
		}
	}

	static isOverdue(createdAt: Date): boolean {
		return TimeCalculator.getHoursBetweenDates(createdAt, new Date()) > this.overdueHourThreshold;
	}

	static isNew(createdAt: Date): boolean {
		return TimeCalculator.getHoursBetweenDates(createdAt, new Date()) < this.newHourThreshold;
	}

	private getRevisionStatusMap(revisions:): DesignStatus[] {
		const statusList = new Array<DesignStatus>();
		const revision = pDesign.revision;

		if (!revision || typeof revision === 'boolean') return statusList;

		statusList.push(<DesignStatus>revision.select.status);
	}
}
