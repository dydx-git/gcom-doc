import prisma from '$db/client';
import hash from 'object-hash';
import { Department, JobType, PriceType, Prisma, UserRoles } from '@prisma/client';
import type { User } from 'lucia-auth';
import type { addressSchema, ClientSchema, ClientSchemaWithoutId, emailSchema, phoneSchema } from './meta';
import type { Email } from '$lib/modules/common/models/email';
import type { IHashId, PromiseArrayElement } from '$lib/modules/common/interfaces/core';
import { Decimal } from '@prisma/client/runtime/library';

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

	public async readClientWithPrice() {
		const clients = await prisma.client.findMany({
			select: {
				id: true, name: true
			}
		});

		const prices = this.getClientPrice(clients.map((client) => client.id));
		return clients;
	}

	public async getClientPrice(clientIds: string[]): Promise<Record<string, Record<PriceType, Decimal>>> {
		const clientSetPrices = await prisma.clientSetPrice.groupBy({
			by: ['clientId', 'type', 'price'],
			where: {
				clientId: {
					in: clientIds
				}
			}
		});

		const calculatedClientPrices = this.getModePrice(clientIds);

		for (const clientId in clientIds) {
			const clientSetPrice = clientSetPrices.find((clientSetPrice) => clientSetPrice.clientId === clientId);
			console.log(clientSetPrice);
		}
	}

	private async getModePrice(clientIds: string[]) {
		const clientPrices = await prisma.job.findMany({
			select: {
				purchaseOrder: {
					select: {
						clientId: true
					}
				},
				price: true,
				vendor: {
					select: {
						department: true
					}
				}
			},
			where: {
				type: JobType.JOB,
			}
		});

		const pricesGroupByClientId: Record<string, Record<string, Decimal[]>> = {};
		// find mode of price for each price type and clientId
		clientPrices.forEach((clientPrice) => {
			const { purchaseOrder: { clientId }, price, vendor: { department } } = clientPrice;
			const clientPriceGroup = pricesGroupByClientId[clientId];
			if (!clientPriceGroup) {
				pricesGroupByClientId[clientId] = { [department]: [price] };
				return;
			}

			const priceGroup = clientPriceGroup[department];
			if (!priceGroup) {
				clientPriceGroup[department] = [price];
				return;
			}

			priceGroup.push(price);
		});

		const modePrices: Record<string, Record<string, Decimal>> = {};
		Object.entries(pricesGroupByClientId).forEach(([clientId, clientPriceGroup]) => {
			const modePriceGroup: Record<string, Decimal> = {};
			Object.entries(clientPriceGroup).forEach(([department, prices]) => {
				const modePrice = getMode(prices);
				modePriceGroup[department] = modePrice;
			});

			modePrices[clientId] = modePriceGroup;
		});

		return modePrices;

		function getMode(arr: Decimal[]) {
			const modeMap: Record<string, number> = {};
			let maxCount = 0;
			let mode = new Decimal(0);
			arr.forEach((num) => {
				const count = modeMap[num.toString()] || 0;
				modeMap[num.toString()] = count + 1;
				if (count + 1 > maxCount) {
					maxCount = count + 1;
					mode = num;
				}
			});
			return mode;
		}
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
		}).catch((err) => {
			console.error(err);
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