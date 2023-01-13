import type { Entity, IHasCreationDate, IHasId, IHasStatus } from './core';
import type { GmailRawId } from './gmail';

export interface IOrder extends IHasId, IHasCreationDate {
	status: OrderStatus | DesignStatus;
	bwdReceivedThreadId: GmailRawId;
	bwdReceivedMsgId: GmailRawId;
	bwdSentMsgId: GmailRawId;
	fwdSentThreadId: GmailRawId;
	revision: Revision;
	design: Design;
	client: Client;
	vendor: Vendor;
}

export interface IRevision extends IHasId, IHasCreationDate {
	description: string;
	status: DesignStatus;
}

export interface IDesign extends Entity, IHasStatus, IHasCreationDate {
	status: DesignStatus;
}

export enum DesignStatus {
	Pending = 0,
	Complete = 1
}

export enum OrderStatus {
	New = -1,
	Overdue = -2
}

export enum RushStatus {
	NotRush = 0,
	Rush = 1,
	SuperRush = 2
}
