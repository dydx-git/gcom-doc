import prisma from '$db/client';
import hash from 'object-hash';
import { UserRoles } from '@prisma/client';
import type { User } from 'lucia-auth';
import type { addressSchema, ClientSchemaWithoutId, emailSchema, phoneSchema, schema } from './meta';

export class Clients {
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

	// TODO: Write a test for this
	private hash(obj: schema): string {
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