import { AttachmentPersister } from '$lib/modules/persister/attachmentPersister';
import { error, json } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { messageId, attachmentId } = params;

    const path = `${messageId}/${attachmentId}`;
    const data = await new AttachmentPersister().read(path);

    if (!data)
        throw error(404, 'Attachment not found');

    return data;
};