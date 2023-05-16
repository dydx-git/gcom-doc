import { AttachmentPersister } from '$lib/modules/persister/attachmentPersister';
import mime from "mime-types";
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const { messageId } = params;
    const attachmentId = url.searchParams.get('id');
    if (!attachmentId)
        throw error(400, 'Missing id');


    const path = `${messageId}/${attachmentId}`;
    const image = await new AttachmentPersister().read(path);

    if (!image)
        throw error(404, 'Attachment not found');

    return {
        ...image,
        data: `data:${mime.lookup(image.filename).toString()};base64,${image.data}`
    }
};