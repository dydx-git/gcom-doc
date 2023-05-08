import type { IAttachment } from 'gmail-api-parse-message-ts';
import type { IHasId } from '../common/interfaces/core';

export class GmailRawId implements IHasId {
	id: string;

	constructor(id: string) {
		this.id = id;
	}

	GetDate(): Date {
		return new Date(parseInt(this.id.slice(0, 13)));
	}
}

export type Attachment = IAttachment & { data: string };