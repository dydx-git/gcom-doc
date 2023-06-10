import { ClientAddressOptionalDefaultsSchema, ClientEmailOptionalDefaultsSchema, ClientOptionalDefaultsSchema, ClientPhoneOptionalDefaultsSchema, ClientSetPriceSchema } from "$lib/zod-prisma";
import { ClientStatus, EmailType, PhoneType, PriceType } from "@prisma/client";
import { z } from "zod";
import { withDefaults } from "../common/functions/core";

export type Address = {
	formattedAddress: string;
	addressLine: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	country: string | null;
};
export interface BingAddressResponse {
	authenticationResultCode: string;
	brandLogoUri: string;
	copyright: string;
	resourceSets?: ResourceSetsEntity[] | null;
	statusCode: number;
	statusDescription: string;
	traceId: string;
}
export interface ResourceSetsEntity {
	estimatedTotal: number;
	resources?: ResourcesEntity[] | null;
}
export interface ResourcesEntity {
	__type: string;
	bbox?: number[] | null;
	name: string;
	point: Point;
	address: BingAddress;
	confidence: string;
	entityType: string;
	geocodePoints?: GeocodePointsEntity[] | null;
	matchCodes?: string[] | null;
}
export interface Point {
	type: string;
	coordinates?: number[] | null;
}
export interface BingAddress {
	addressLine: string;
	adminDistrict: string;
	adminDistrict2: string;
	countryRegion: string;
	formattedAddress: string;
	locality: string;
	postalCode: string;
}
export interface GeocodePointsEntity {
	type: string;
	coordinates?: number[] | null;
	calculationMethod: string;
	usageTypes?: string[] | null;
}

export const ClientSchemaWithoutId = ClientOptionalDefaultsSchema.omit({ id: true });
export type ClientSchemaWithoutId = z.infer<typeof ClientSchemaWithoutId>;

const emailSchema = ClientEmailOptionalDefaultsSchema.omit({ clientId: true });
export type emailSchema = z.infer<typeof emailSchema>;
const phoneSchema = ClientPhoneOptionalDefaultsSchema.omit({ clientId: true });
export type phoneSchema = z.infer<typeof phoneSchema>;
const addressSchema = ClientAddressOptionalDefaultsSchema.omit({ clientId: true });
export type addressSchema = z.infer<typeof addressSchema>;
const priceSchema = ClientSetPriceSchema.omit({ clientId: true }).extend({
	price: z.number().default(() => 0)
});
export type priceSchema = z.infer<typeof priceSchema>;

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
	address: addressSchema,
	prices: z.array(priceSchema).default(() => [
		{ price: 0, type: PriceType.LEFTCHEST },
		{ price: 0, type: PriceType.FULLBACK },
		{ price: 0, type: PriceType.VECTOR }
	])
});

export type ClientSchema = z.infer<typeof schema>;