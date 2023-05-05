import type { Email } from '$lib/modules/common/models/email';

export interface INamed {
	name: string;
}

export interface IHasId {
	id: string | number;
}

export interface IEntity extends INamed, IHasId { }

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

export type PromiseArrayElement<ArrayType extends Promise<unknown[]>> =
	ArrayType extends Promise<(infer ElementType)[]> ? ElementType : never;

export type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;
