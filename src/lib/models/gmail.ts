import type { IHasId } from '../interfaces/core';

export class GmailRawId implements IHasId {
	id: string;

	constructor(id: string) {
		this.id = id;
	}

	GetDate(): Date {
		return new Date(parseInt(this.id.slice(0, 13)));
	}
}
