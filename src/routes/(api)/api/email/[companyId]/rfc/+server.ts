import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Gmailer } from '$lib/modules/gmail/gmail';
import prisma from '$db/client';
import { GmailDataTransformer } from '$lib/modules/gmail/dataTransformer';

export const GET: RequestHandler = async ({ url, params }) => {
    const rfcId = url.searchParams.get('id');
    if (!rfcId)
        throw error(400, 'Missing id');

    const company = await prisma.company.findUnique({ where: { id: +params.companyId } });
    if (!company)
        throw error(404, 'Company not found');

    const gmail = await Gmailer.getInstance(company);

    const data = await gmail.getMessageFromSearch(rfcId);
    if (!data)
        throw error(404, 'Email not found');

    const response = await new GmailDataTransformer(data).toRfcEmailResponse();

    return json(response);
};