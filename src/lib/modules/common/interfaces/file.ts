import { z } from 'zod';

export const fileInfoSchema = z.object({
    filename: z.string(),
    mimeType: z.string(),
    size: z.number()
});
export type GenericFileInfo = z.infer<typeof fileInfoSchema>;

export const fileSchema = fileInfoSchema.extend({
    data: z.string()
});
export type FileSchema = z.infer<typeof fileSchema>;