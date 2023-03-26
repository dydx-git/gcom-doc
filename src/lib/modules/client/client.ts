import prisma from '$db/client';
import type { ClientOptionalDefaults } from '$lib/zod-prisma';
import { UserRoles, Prisma } from '@prisma/client';
import type { User } from 'lucia-auth';

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

		return await prisma.client.findMany({
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

	public async create(client: ClientOptionalDefaults, address: Prisma.ClientAddressCreateWithoutClientInput, emails: Prisma.Enumerable<Prisma.ClientEmailCreateManyClientInput>, phones: Prisma.Enumerable<Prisma.ClientPhoneCreateManyClientInput>) {
		const addedClient = await prisma.client.create({
			data: {
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
}