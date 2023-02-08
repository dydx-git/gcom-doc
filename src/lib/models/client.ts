import client from '$db/client';

export class Clients {
	// it should expect a user id
	public async read(): Promise<any> {
		return await client.client.findMany({
			include: {
				ClientSalesRepCompany: {
					include: {
						company: {
							select: {
								whe
							}
						},
						salesRep: true
					}
				},
				addresses: true,
				emails: true,
				phones: true
			},
			where: {
				ClientSalesRepCompany: {
					every: {
						fromDate: {
							equals: await client.clientSalesRepCompany.groupBy({
								_max: {
									fromDate: true
								},
								by: ['clientId', 'fromDate'],
								orderBy: {
									fromDate: 'desc'
								},
								take: 1
							})
						}
					}
				}
			}
		});
	}
}
