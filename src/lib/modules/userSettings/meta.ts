import { UserSettingsSchema } from "$lib/prisma/zod";
import { z } from "zod";
import { withDefaults } from "../common/functions/core";

const userSettingsWithoutId = UserSettingsSchema.omit({ username: true });

export const userSettings = withDefaults(userSettingsWithoutId, {
	settings: {
		datatable: {
			order: {
				perPage: 30,
				showRecordsForLastDays: 40,
			},
		},
	}
});


export const settingsSchema = z.object({
	datatable: z.object({
		order: z.object({
			perPage: z.number(),
			showRecordsForLastDays: z.number(),
		}),
	}),
	theme: z.enum(['light', 'dark']),
	inputToProcessDelay: z.number()
});

export type Settings = z.infer<typeof settingsSchema>;

const settings = withDefaults(settingsSchema, {
	datatable: {
		order: {
			perPage: 30,
			showRecordsForLastDays: 40,
		},
	},
	theme: 'light',
	inputToProcessDelay: 500
});

export const defaultSettings: Settings = settings.parse({});