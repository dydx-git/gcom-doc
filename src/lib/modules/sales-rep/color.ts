import client from '$db/client';
import {
	hasGoodContrastWithThemeColors,
	hexToHSL,
	isBoldAndBright,
	validateHexCodes,
	type hslType
} from '$lib/utils/colorHelper';
import type { Prisma } from '@prisma/client';
import type { IDbCRUD } from '../common/interfaces/db';
import type { SalesRepColors } from './meta';

export class SalesRepColor implements IDbCRUD {
	public async read(args: Prisma.SalesRepColorsArgs | null = null) {
		return await client.salesRepColors.findMany({ ...args });
	}

	public async create(args: SalesRepColors, username: string) {
		SalesRepColor.validateColors(args);
		const data = { ...args, salesRepUsername: username };

		return await client.salesRepColors.create({ data });
	}

	public async update(id: string, args: SalesRepColors) {
		return await client.salesRepColors.update({
			where: { salesRepUsername: id },
			data: args
		});
	}

	public async delete(id: string) {
		return await client.salesRepColors.delete({ where: { salesRepUsername: id } });
	}

	public static validateColors(colors: SalesRepColors) {
		// check if any item in colors is repeated
		const colorSet = new Set(Object.values(colors));
		if (colorSet.size !== Object.values(colors).length) throw new Error('Colors must be unique');

		const colorsList = Object.values(colors);
		validateHexCodes(colorsList);

		for (const color of colorsList)
			if (!hasGoodContrastWithThemeColors(color))
				throw new Error(`${color} does not have good contrast with theme colors`);

		const { primaryColor } = colors;
		SalesRepColor.validatePrimaryColor(hexToHSL(primaryColor));
	}

	private static validatePrimaryColor(primaryColor: hslType) {
		if (!isBoldAndBright(primaryColor)) throw new Error('Primary color must be bold and bright');
	}
}
