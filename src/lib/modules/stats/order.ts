import prisma from "$db/client";
import type { Department } from "@prisma/client";
import dayjs from "dayjs";

export class OrderStats {
    public getOrderCount(date: Date) {
        return prisma.job.count({
            where: {
                createdAt: {
                    gte: date
                }
            }
        });
    }

    public async getPendingOrderDetails() {
        const pendingOrders = await prisma.job.findMany({
            select: {
                vendor: {
                    select: {
                        department: true
                    }
                },
                createdAt: true,
            },
            where: {
                status: {
                    in: ['PENDING', 'RUSH']
                }
            },
        });

        const yesterday = dayjs().subtract(1, 'day');
        const result: PendingOrderDetails[] = [];

        pendingOrders.forEach(order => {
            const { vendor: { department }, createdAt } = order;
            result.push({
                type: department,
                isOverdue: dayjs(createdAt).diff(yesterday, 'day') > 1
            });
        });

        return result;
    }
}

export type PendingOrderDetails = {
    type: Department,
    isOverdue: boolean
}