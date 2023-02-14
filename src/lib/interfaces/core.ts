import type { Email } from '$lib/models/email';

export interface INamed {
	name: string;
}

export interface IHasId {
	id: string | number;
}

export interface IEntity extends INamed, IHasId {}

export interface IHasEmail {
	email: Email;
}

export interface IHasEmails {
	emails: Email[];
}

export interface IHasDate {
	date: Date;
}

export interface ISupportsAdditionalEmail extends IHasEmails {
	additionalEmail: Email[];
}

export enum Environment {
	Development = 'DEV',
	Production = 'PROD'
}
