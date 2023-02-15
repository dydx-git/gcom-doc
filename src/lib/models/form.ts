export type ValidatedInput = {
	invalid: boolean;
	invalidText: string;
};

export type BingAddress = {
	formattedAddress: string;
	addressLine: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	country: string | null;
};
