import { withDefaults } from "$lib/modules/common/functions/core";
import { ClientAddressOptionalDefaultsSchema, ClientEmailOptionalDefaultsSchema, ClientOptionalDefaultsSchema, ClientPhoneOptionalDefaultsSchema } from "$lib/zod-prisma";
import { EmailType, PhoneType, type Client, type ClientAddress, type ClientPhone } from "@prisma/client";
import { z } from "zod";

export enum FormSubmitType {
    AddNew,
    Edit
}

const emailSchema = ClientEmailOptionalDefaultsSchema.omit({ clientId: true });
const phoneSchema = ClientPhoneOptionalDefaultsSchema.omit({ clientId: true });

export const schema = z.object({
    client: ClientOptionalDefaultsSchema,
    emails: z
        .array(emailSchema)
        .default(() => [
            { email: '', type: EmailType.JOB }
        ]),
    phones: z.array(phoneSchema).default(() => [
        { phone: '', type: PhoneType.PRIMARY }
    ]),
    address: ClientAddressOptionalDefaultsSchema.omit({ clientId: true })
});