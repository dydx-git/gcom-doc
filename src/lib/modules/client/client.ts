import prisma from '$db/client';
import hash from 'object-hash';
import { Prisma, UserRoles } from '@prisma/client';
import type { User } from 'lucia-auth';
import type { addressSchema, ClientSchema, ClientSchemaWithoutId, emailSchema, phoneSchema } from './meta';
import type { Email } from '$lib/modules/common/models/email';
import type { IHashId, PromiseArrayElement } from '$lib/modules/common/interfaces/core';

export class Clients implements IHashId {
	public include: Prisma.ClientInclude;

	constructor(include: Prisma.ClientInclude = {
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
	}) {
		this.include = include;
	}

	public async read(user: User) {
		const where =
			user.role == UserRoles.USER
				? {
					salesRep: {
						username: user.username
					}
				}
				: {};

		const data = await prisma.client.findMany({
			include: this.include,
			where
		});

		return data;
	}

	public async readById(clientId: string) {
		return await prisma.client.findUnique({
			where: {
				id: clientId
			},
			include: this.include
		});
	}

	public async getEmails(clientId: string) {
		const data = await prisma.client.findUnique({
			where: {
				id: clientId
			},
			select: {
				emails: true
			}
		});

		return data?.emails;
	}

	public async getClient(clientId: string): Promise<ClientReadSchema>;
	public async getClient(fromEmails: Email[]): Promise<ClientReadSchema | null>;
	public async getClient(clientIdOrEmails: string | Email[]): Promise<ClientReadSchema | null> {
		if (typeof clientIdOrEmails === 'string') {
			return this.getClientFromClientId(clientIdOrEmails);
		} else {
			return this.getClientFromEmails(clientIdOrEmails);
		}
	}

	private async getClientFromClientId(clientId: string): Promise<ClientReadSchema> {
		const data = await prisma.client.findUnique({
			where: {
				id: clientId
			},
			include: this.include
		});

		if (!data)
			throw new Error('Client not found');

		return data;
	}

	private async getClientFromEmails(fromEmails: Email[]) {
		const data = await prisma.client.findFirst({
			where: {
				emails: {
					some: {
						email: {
							in: fromEmails.map((email) => email.address)
						}
					}
				}
			},
			include: this.include
		});

		return data;
	}


	public async create(client: ClientSchemaWithoutId, address: addressSchema, emails: Array<emailSchema>, phones: Array<phoneSchema>) {
		const id = this.hash({ client, emails, phones, address });

		const addedClient = await prisma.client.create({
			data: {
				id,
				...client,
				clientAddress: {
					create: address
				},
				emails: {
					createMany: {
						data: emails
					}
				},
				phones: {
					create: phones
				}
			}
		});

		await prisma.clientSalesRepCompany.updateMany({
			data: {
				toDate: new Date(),
				isActive: false
			},
			where: {
				client: addedClient
			}
		});

		prisma.clientSalesRepCompany.create({
			data: {
				clientId: addedClient.id,
				salesRepUsername: client.salesRepUsername,
				companyId: client.companyId
			}
		});

		return addedClient;
	}

	public hash(obj: ClientSchema): string {
		const { client, emails, phones } = obj;

		return hash({
			name: client.name,
			companyId: client.companyId,
			username: client.salesRepUsername,
			emails: emails.map((e) => e.email),
			phones: phones.map((p) => p.phone)
		}, { algorithm: 'md5' });
	}

}

type ClientsReadSchema = ReturnType<Clients['read']>;
type ClientReadSchema = PromiseArrayElement<ClientsReadSchema>;