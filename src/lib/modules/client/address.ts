// create class called Address that has the method called getParsedAddress that takes a string and returns Address[]

import { BING_MAPS_ENDPOINT, BING_MAPS_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";

export class Address {
    static async getParsedAddress(address: string): Promise<Address[]> {
        const result: Address[] = [];

        try {
            const response: Response = await fetch(
                `${BING_MAPS_ENDPOINT}${encodeURIComponent(address)}?includeNeighborhood=0&key=${BING_MAPS_KEY}&strictMatch=1`
            );
            const parsedResponse: BingAddressResponse = await response.json();
            const { resourceSets } = parsedResponse;
            const resourceEntities = resourceSets?.[0];

            if (!resourceEntities || resourceEntities.estimatedTotal === 0 || !resourceEntities.resources)
                return result;

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
        } catch (e) {
            // pass
        }

        return result;
    }
}

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
