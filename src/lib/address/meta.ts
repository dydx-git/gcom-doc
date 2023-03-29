

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