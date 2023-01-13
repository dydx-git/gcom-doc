import type { DesignStatus, OrderStatus } from './order';

export interface IHasStatus {
	status: OrderStatus | DesignStatus;
}
