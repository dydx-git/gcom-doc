export function convertToFormData(obj: unknown): FormData {
	const formData = new FormData();
	if (typeof obj !== 'object' || obj === null) return formData;

	const objAsRecord = obj as Record<string, string>;
	for (const [key, value] of Object.entries(objAsRecord)) {
		formData.append(key, value);
	}

	return formData;
}
