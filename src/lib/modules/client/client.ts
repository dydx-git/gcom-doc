import prisma from '$db/client';
import hash from 'object-hash';
import { Department, JobType, PriceType, Prisma, UserRoles } from '@prisma/client';
import type { addressSchema, ClientSchema, ClientSchemaWithoutId, emailSchema, phoneSchema, priceSchema } from './meta';
import type { Email } from '$lib/modules/common/models/email';
import type { IHashId, IReadById, PromiseArrayElement } from '$lib/modules/common/interfaces/core';
import { Decimal } from '@prisma/client/runtime/library';
import { logger } from '$lib/logger';
import type { User } from 'lucia';

export class Clients implements IHashId, IReadById {
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

	public async readClientsWithPrices(user: User | null = null) {
		const clients = await prisma.client.findMany({
			select: {
				id: true, name: true
			},
			where: {
				salesRep: {
					username: user?.username
				}
			}
		});
		if (!clients.length)
			throw new Error('No clients found');

		const prices = await this.getClientsPrices(clients.map((client) => client.id));

		return clients.map((client) => ({
			...client,
			prices: prices[client.id]
		}));
	}

	public async getClientsPrices(clientIds: string[]): Promise<Record<string, Record<PriceType, string>>> {
		const result = {} as Record<string, Record<PriceType, string>>;

		const clientSetPrices = await prisma.clientSetPrice.groupBy({
			by: ['clientId', 'type', 'price'],
			where: {
				clientId: {
					in: clientIds
				}
			}
		});

		const calculatedClientPrices = await this.getModePrice(clientIds);
		const departmentToPriceType: Record<Department, PriceType> = {
			[Department.DIGITIZING]: PriceType.LEFTCHEST,
			[Department.VECTOR]: PriceType.VECTOR,
			[Department.PATCH]: PriceType.UNKNOWN,
		}

		for (const clientId of clientIds) {
			const clientSetPrice = clientSetPrices.find((clientSetPrice) => clientSetPrice.clientId === clientId);

			if (clientSetPrice) {
				const { type } = clientSetPrice;
				const price = clientSetPrice.price.toFixed(2);
				if (!result[clientId])
					result[clientId] = { [type]: price } as Record<PriceType, string>;
				else
					result[clientId][type] = price;
				continue;
			}

			const calculatedClientPrice = calculatedClientPrices[clientId];
			if (!calculatedClientPrice) {
				logger.warn(`Client ${clientId} not found in calculatedClientPrices`);
				continue;
			}
			result[clientId] = {} as Record<PriceType, string>;
			for (const [department, price] of Object.entries(calculatedClientPrice)) {
				result[clientId][departmentToPriceType[department as Department]] = price.toFixed(2);
			}
		}

		return result;
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
				purchaseOrder: {
					clientId: {
						in: clientIds
					}
				}
			}
		});

		const pricesGroupByClientId: Record<string, Record<Department, Decimal[]>> = {};
		// find mode of price for each price type and clientId
		clientPrices.forEach((clientPrice) => {
			if (!clientPrice.purchaseOrder?.clientId) {
				logger.warn(`Client ${clientPrice.purchaseOrder?.clientId} not found in clientPrices`);
				return;
			}

			const { purchaseOrder: { clientId }, price, vendor: { department } } = clientPrice;
			const clientPriceGroup = pricesGroupByClientId[clientId];
			if (!clientPriceGroup) {
				pricesGroupByClientId[clientId] = { [department]: [price] } as Record<Department, Decimal[]>;
				return;
			}

			const priceGroup = clientPriceGroup[department];
			if (!priceGroup) {
				clientPriceGroup[department] = [price];
				return;
			}

			priceGroup.push(price);
		});

		const modePrices: Record<string, Record<Department, Decimal>> = {};
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


	public async create(client: ClientSchemaWithoutId, address: addressSchema, emails: Array<emailSchema>, phones: Array<phoneSchema>, prices: Array<priceSchema> | null | undefined) {
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
		logger.info(`Client ${addedClient.name} created`);

		await prisma.clientSalesRepCompany.updateMany({
			data: {
				toDate: new Date(),
				isActive: false
			},
			where: {
				client: addedClient
			}
		});
		logger.info(`Client ${addedClient.name} sales rep updated`);

		prisma.clientSalesRepCompany.create({
			data: {
				clientId: addedClient.id,
				salesRepUsername: client.salesRepUsername,
				companyId: client.companyId
			}
		}).catch((err) => {
			logger.error(err);
		});

		if (prices) {
			prisma.clientSetPrice.createMany({
				data: prices.filter(price => price.price > 0).map(price => ({
					...price,
					clientId: addedClient.id
				}))
			}).catch((err) => {
				logger.error(err);
			});
			logger.info(`Client ${addedClient.name} default prices set.`);
		}

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