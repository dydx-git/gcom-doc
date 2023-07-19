import { UserSettingsSchema } from "$lib/zod-prisma";
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
});

export type Settings = z.infer<typeof settingsSchema>;

const settings = withDefaults(settingsSchema, {
	datatable: {
		order: {
			perPage: 30,
			showRecordsForLastDays: 40,
		},
	},
});

export const defaultSettings: Settings = settings.parse({});