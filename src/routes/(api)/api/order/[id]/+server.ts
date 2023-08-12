import client from "$db/client";
import { PUBLIC_SSE_CHANNEL } from "$env/static/public";

export async function DELETE({ params, locals }) {
    const { id } = params;

    Promise.all([
        client.job.delete({ where: { id } }),
        client.purchaseOrder.delete({ where: { primaryJobId: id } })
    ]);

    const { room } = locals;
    room.sendEveryone(PUBLIC_SSE_CHANNEL, { path: '/order' });

    return new Response(null, { status: 204 });
}