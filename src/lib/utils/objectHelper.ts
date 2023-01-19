export function getVariableName(obj: object): string {
	const keys = Object.keys(obj);
	console.assert(keys.length == 1, 'key count must be 1');
	return keys[0];
}
