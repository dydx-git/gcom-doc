import { z } from 'zod';
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

export const fileInfoSchema = z.object({
	filename: z.string(),
	mimeType: z.string(),
	size: z.number()
});
export type GenericFileInfo = z.infer<typeof fileInfoSchema>;

export const fileSchema = fileInfoSchema.extend({
	data: z.string()
});
export type FileSchema = z.infer<typeof fileSchema>;