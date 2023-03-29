import client from "$db/client";
import { Gmailer } from "$lib/modules/gmail/gmail";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
    const company = await client.company.findFirst();
    if (!company)
        throw error(500, "No company found");

    try {
        const gmailer = Gmailer.getInstance(company);
        return json({ gmailer });
    } catch (error) {
        return new Response("Error");
    }
};