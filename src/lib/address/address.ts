import { BING_MAPS_ENDPOINT, BING_MAPS_KEY } from "$env/static/private";
import type { Address, BingAddressResponse } from "./meta";

export class AddressParser {
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


