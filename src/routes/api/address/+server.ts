import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BING_MAPS_ENDPOINT, BING_MAPS_KEY } from '$env/static/private';

export type Address = {
	formattedAddress: string;
	addressLine: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	country: string | null;
};

export const GET: RequestHandler = async (req) => {
	const inputAddress = req.url.searchParams.get('address');
	if (!inputAddress) throw error(400, { message: 'Missing parameter: address' });

	const address = encodeURIComponent(inputAddress);
	const response: Response = await fetch(
		`${BING_MAPS_ENDPOINT}${address}?includeNeighborhood=0&key=${BING_MAPS_KEY}&strictMatch=1`
	);

	if (!response.ok) throw error(response.status, { message: response.statusText });

	const result: Address[] = [];

	const parsedResponse: BingAddressResponse = await response.json();
	const { resourceSets } = parsedResponse;
	const resourceEntities = resourceSets?.[0];
	if (!resourceEntities || resourceEntities.estimatedTotal === 0 || !resourceEntities.resources)
		throw error(404, { message: 'No results found' });

	resourceEntities.resources.forEach((resource) => {
		if (resource.confidence == 'Low') return;
		const address = resource.address;
		result.push({
			formattedAddress: address?.formattedAddress,
			addressLine: address?.addressLine,
			city: address?.locality,
			state: address?.adminDistrict || address?.adminDistrict2,
			zip: address?.postalCode,
			country: address?.countryRegion
		});
	});

	return json(result);
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
