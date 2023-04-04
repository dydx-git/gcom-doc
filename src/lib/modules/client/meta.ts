import { ClientAddressOptionalDefaultsSchema, ClientEmailOptionalDefaultsSchema, ClientOptionalDefaultsSchema, ClientPhoneOptionalDefaultsSchema } from "$lib/zod-prisma";
import { ClientStatus, EmailType, PhoneType } from "@prisma/client";
import { z } from "zod";
import { withDefaults } from "../common/functions/core";

export const ClientSchemaWithoutId = ClientOptionalDefaultsSchema.omit({ id: true });
export type ClientSchemaWithoutId = z.infer<typeof ClientSchemaWithoutId>;

const emailSchema = ClientEmailOptionalDefaultsSchema.omit({ clientId: true });
export type emailSchema = z.infer<typeof emailSchema>;
const phoneSchema = ClientPhoneOptionalDefaultsSchema.omit({ clientId: true });
export type phoneSchema = z.infer<typeof phoneSchema>;
const addressSchema = ClientAddressOptionalDefaultsSchema.omit({ clientId: true });
export type addressSchema = z.infer<typeof addressSchema>;

export const schema = z.object({
	client: withDefaults(ClientSchemaWithoutId, { status: ClientStatus.ACTIVE, salesRepUsername: undefined }),
	emails: z
		.array(emailSchema)
		.default(() => [
			{ email: '', type: EmailType.JOB, description: '' }
		]),
	phones: z.array(phoneSchema).default(() => [
		{ phone: '', type: PhoneType.PRIMARY, description: '' }
	]),
	address: addressSchema
});

export type schema = z.infer<typeof schema>;