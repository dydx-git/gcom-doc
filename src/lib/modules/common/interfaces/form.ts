export type ValidatedInput = {
	invalid: boolean;
	invalidText: string;
};

export type ValidatedFormElements = {
	[key: string]: ValidatedInput;
}
