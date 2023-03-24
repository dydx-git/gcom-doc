import { SalesRepColorsSchema, SalesRepOptionalDefaultsSchema, UserRolesSchema } from "$lib/zod-prisma";
import { z } from "zod";

export const schema = z.object({
    colors: SalesRepColorsSchema.omit({ salesRepUsername: true }),
    auth: z.object({
        username: z
            .string()
            .min(4, { message: 'Username must be at least 4 characters long' })
            .max(10, { message: 'Username cannot be longer than 10 characters' })
            .regex(/^[a-z0-9]+$/, {
                message: 'Username can only contain lowercase alphanumeric characters'
            }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, {
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        role: UserRolesSchema
    }),
    salesRep: SalesRepOptionalDefaultsSchema
});