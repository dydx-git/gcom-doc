import { error, fail, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Gmailer } from '$lib/modules/gmail/gmail';
import prisma from '$db/client';

export const GET: RequestHandler = async ({ url, params }) => {
    const rfcId = url.searchParams.get('id');
    if (!rfcId)
        throw new Error('Missing id');

    const company = await prisma.company.findUnique({ where: { id: +params.companyId } });
    if (!company)
        throw new Error('Company not found');

    const gmail = Gmailer.getInstance(company);

    return json(gmail.getMessageFromRfcId(rfcId.replace("rfc822msgid:", "")));
};