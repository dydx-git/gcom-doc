import client from '$db/client';
import {
	UserRoles,
	type Client,
	type ClientAddress,
	type ClientEmail,
	type ClientPhone
} from '@prisma/client';
import type { User } from 'lucia-auth';

export type ClientsWithSalesRepAndCompany = (Client & {
	emails: ClientEmail[];
	phones: ClientPhone[];
	clientAddress: ClientAddress | null;
	salesRep: {
		id: number;
		name: string;
	};
	company: {
		id: number;
		name: string;
	};
})[];

export class Clients {
	public async read(user: User): Promise<ClientsWithSalesRepAndCompany> {
		const where =
			user.role == UserRoles.USER
				? {
						salesRep: {
							username: user.username
						}
				  }
				: {};

		return await client.client.findMany({
			include: {
				emails: true,
				phones: true,
				salesRep: {
					select: {
						id: true,
						name: true
					}
				},
				company: {
					select: {
						id: true,
						name: true
					}
				},
				clientAddress: true
			},
			where
		});
	}
}
