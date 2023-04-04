import { UserSettingsSchema } from "$lib/zod-prisma";
import { withDefaults } from "../common/functions/core";

const userSettingsWithoutId = UserSettingsSchema.omit({ username: true });

export const userSettings = withDefaults(userSettingsWithoutId, {
	settings: {

	}
});