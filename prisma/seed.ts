import { ClientStatus, Currency, EmailType, PayMethod, PhoneType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createCompany() {
    return await prisma.company.create({
        data: {
            name: 'Acme Corporation',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
            country: 'USA',
            phone: '123-456-7890',
            email: 'john@example.com',
            website: 'https://example.com',
        },
    });
}

async function createClient() {
    const company = await createCompany();
    const salesRep = await prisma.salesRep.create({
        data: {
            username: 'admin',
            name: 'John Doe',
            email: 'john@doe.com',
            phone: '123-456-7890',
            companyId: company.id,
        }
    });
    const client = await prisma.client.create({
        data: {
            id: 'client1',
            name: 'John Doe',
            companyName: 'Acme Corporation',
            addTransactionCharges: true,
            payMethod: PayMethod.CREDIT_CARD,
            currency: 'USD',
            status: ClientStatus.ACTIVE,
            salesRepUsername: salesRep.username,
            companyId: company.id,
            clientAddress: {
                create: {
                    address: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zip: '12345',
                    country: 'USA',
                },
            },
            phones: {
                create: [
                    {
                        phone: '123-456-7890',
                        type: PhoneType.PRIMARY,
                    },
                    {
                        phone: '123-456-7890',
                        type: PhoneType.SECONDARY,
                    },
                ]
            },
            emails: {
                create: [
                    {
                        email: 'me@salesRep.com',
                        type: EmailType.JOB,
                    },
                    {
                        email: 'notme@salesRep.com',
                        type: EmailType.INVOICE,
                    }
                ]
            },
            orders: {
                create: [
                    {
                        id: 'order1',
                        jobs: {
                            create: [
                                {
                                    id: 'job1',
                                    name: 'Design a logo',
                                    price: 1000.0,
                                    type: 'Design',
                                    status: 'Pending',
                                    vendor: {
                                        create: {
                                            name: 'Design Co.',
                                            email: 'designco@example.com',
                                            department: 'Design',
                                            status: 'Active',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        id: 'order2',
                        jobs: {
                            create: [
                                {
                                    id: 'job2',
                                    name: 'Design a logo',
                                    price: 1000.0,
                                    type: 'Design',
                                    status: 'Pending',
                                    vendor: {
                                        create: {
                                            name: 'Design Co.',
                                            email: 'islo@df.com',
                                            department: 'Design',
                                            status: 'Active',
                                        },
                                    },
                                },
                            ],
                        },
                    }
                ]
            }
        },
    });
}

async function main() {
    console.log(`Start seeding ...`);
    await createClient();
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })