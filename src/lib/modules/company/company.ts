import prisma from '$db/client';

export class Companies {
    public async readById(id: number) {
        return await prisma.company.findUnique({
            where: { id }
        });
    }
}