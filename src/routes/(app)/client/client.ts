import client from '$db/client';
import {
    UserRoles
} from '@prisma/client';
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
