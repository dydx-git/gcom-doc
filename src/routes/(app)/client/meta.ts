import { ClientAddressOptionalDefaultsSchema, ClientEmailOptionalDefaultsSchema, ClientOptionalDefaultsSchema, ClientPhoneOptionalDefaultsSchema } from "$lib/zod-prisma";
import { z } from "zod";

export enum FormSubmitType {
    AddNew,
    Edit
}

export const schema = z.object({
    client: ClientOptionalDefaultsSchema,
    emails: z.array(ClientEmailOptionalDefaultsSchema.omit({ clientId: true })),
    phones: z.array(ClientPhoneOptionalDefaultsSchema.omit({ clientId: true })),
    address: ClientAddressOptionalDefaultsSchema.omit({ clientId: true })
});