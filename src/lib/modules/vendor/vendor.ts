import prisma from '$db/client';
import { JobStatus, type Department, type VendorStatus } from '@prisma/client';
import dayjs from 'dayjs';

export class Vendors {
    public async read() {
        return await prisma.vendor.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    }

    public async create(data: { name: string, email: string, department: Department, status: VendorStatus }) {
        return await prisma.vendor.create({
            data
        });
    }

    public async getPendingOrdersAggregate() {
        const data = await prisma.vendor.findMany({
            select: {
                id: true,
                name: true,
                orders: {
                    select: { status: true, createdAt: true },
                    where: {
                        status: {
                            in: [JobStatus.PENDING, JobStatus.RUSH]
                        },
                    }
                }
            }
        });

        const yesterday = dayjs().subtract(1, 'day');

        return data.map(vendor => {
            const { orders } = vendor;
            const pendingOrders = orders.filter(order => order.status === JobStatus.PENDING).length;
            const overdueOrders = orders.filter(order => order.status === JobStatus.PENDING && dayjs().diff(yesterday, 'day') > 1).length;
            const rushOrders = orders.filter(order => order.status === JobStatus.RUSH).length;

            return {
                ...vendor,
                orders: {
                    pending: pendingOrders,
                    overdue: overdueOrders,
                    rush: rushOrders
                }
            }
        });
    }

}