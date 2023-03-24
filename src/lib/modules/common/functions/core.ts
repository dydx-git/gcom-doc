import { z, type ZodTypeAny } from "zod";

export function withDefaults<T extends z.AnyZodObject>(schema: T, defaults: Partial<z.output<T>>): T {
	const defaultSchemaShape = Object.entries(defaults).reduce((acc, [key, value]) => {
		acc[key] = (schema as any).shape[key].default(value);
		return acc;
	}, {} as Record<string, ZodTypeAny>);

	const defaultSchema = z.object(defaultSchemaShape);
	return schema.merge(defaultSchema) as T;
}

// example usage
// const schema = withDefaults(z.object({ a: z.string() }), { a: 'b' });