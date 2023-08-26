import client from "$db/client";
import { PUBLIC_SSE_CHANNEL } from "$env/static/public";
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const { id } = params;

    await client.job.delete({ where: { id } });
    await client.purchaseOrder.delete({ where: { primaryJobId: id } });

    const { room } = locals;
    room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: '/order' });

    return new Response(null, { status: 204 });
}