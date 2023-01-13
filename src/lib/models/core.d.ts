export interface INamed {
	name: string;
}

export interface IHasId {
	id: string | number;
}

export interface IEntity extends INamed, IHasId {}

export interface IHasCreationDate {
	createdAt: Date;
}

export interface IHasEmail {
	email: string;
}
