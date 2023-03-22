import type { FormSubmitResult } from '$lib/modules/client/meta';

export function verifyAgainst<T>(against: T, formData: FormData): FormSubmitResult {
	const result: FormSubmitResult = {
		success: true,
		errors: []
	};
	const formKeys = Array.from(formData.keys());
	for (const prop in against) {
		if (!formKeys.includes(prop)) {
			result.success = false;
			result.errors.push(`Missing property: ${prop}`);
		}
	}

	return result;
}

export function createObjectFromFormData<T>(formData: FormData): T {
	const obj = {} as any;
	for (const [key, value] of formData) {
		obj[key] = value as keyof T;
	}

	return obj as T;
}

export function validateObject<T extends Record<string, unknown>>(obj: T): T {
	const props: Array<keyof T> = Object.keys(obj) as Array<keyof T>;
	const missingProps = props.filter((prop) => !(prop in obj));

	if (missingProps.length > 0) throw new Error(`Missing properties: ${missingProps.join(', ')}`);

	return obj;
}
