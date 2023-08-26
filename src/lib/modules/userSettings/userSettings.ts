import prisma from '$db/client';
import type { Prisma } from '@prisma/client';
import { settingsSchema, type Settings, defaultSettings } from './meta';

export class UserSettings {
	static settings: Settings | null = null;

	public async read(args: Prisma.UserSettingsWhereUniqueInput) {
		if (UserSettings.settings)
			return UserSettings.settings;

		const data = await prisma.userSettings.findUnique({ where: args });
		if (!data?.settings || typeof data.settings !== 'object')
			return defaultSettings;
		const settings = data?.settings as Prisma.JsonObject;

		UserSettings.settings = settingsSchema.parse(settings) ?? defaultSettings;

		return UserSettings.settings;
	}

	public async create(args: Prisma.UserSettingsUncheckedCreateInput) {
		UserSettings.invalidate();
		return await prisma.userSettings.create({ data: args });
	}

	public async update(username: string, args: Prisma.UserSettingsUncheckedUpdateInput) {
		UserSettings.invalidate();
		return await prisma.userSettings.update({
			where: { username: username },
			data: args
		});
	}

	public static invalidate() {
		UserSettings.settings = null;
	}
}