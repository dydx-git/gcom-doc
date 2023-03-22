export interface SalesRepColors {
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	auxiliaryColor: string;
}

export interface SalesRepColorsCreateData extends SalesRepColors, Record<string, unknown> {}
