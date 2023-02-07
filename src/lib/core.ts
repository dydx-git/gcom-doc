import type { FormSubmitResult } from '$lib/models/client-form';

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
