import type { StatusCode } from "./core";

export type ValidatedInput = {
	invalid: boolean;
	invalidText: string;
};

export type ValidatedFormElements = {
	[key: string]: ValidatedInput;
}