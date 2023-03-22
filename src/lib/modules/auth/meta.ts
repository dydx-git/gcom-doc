import { UserRoles } from '@prisma/client';
import type { SalesRepColors } from '../sales-rep/meta';

export const UserRoleLabels: { [key in UserRoles]: string } = {
	[UserRoles.ADMIN]: UserRoles.ADMIN,
	[UserRoles.MANAGER]: UserRoles.MANAGER,
	[UserRoles.USER]: UserRoles.USER
};

export interface UserCreateData extends Record<string, unknown> {
	username: string;
	password: string;
	name: string;
	email: string;
	phone: string;
	role: UserRoles;
	companyId: number;
	colors: SalesRepColors;
}
