import client from '$db/client';
import type { Prisma } from '@prisma/client';

export class UserSettings {
	public async read(args: Prisma.UserSettingsArgs | null = null) {
		return await client.userSettings.findMany({ ...args });
	}

	public async create(args: Prisma.UserSettingsUncheckedCreateInput) {
		return await client.userSettings.create({ data: args });
	}

	public async update(username: string, args: Prisma.UserSettingsUncheckedUpdateInput) {
		return await client.userSettings.update({
			where: { username: username },
			data: args
		});
	}
}