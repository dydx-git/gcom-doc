import { UserRoles } from '@prisma/client';

export const UserRoleLabels: { [key in UserRoles]: string } = {
	[UserRoles.ADMIN]: UserRoles.ADMIN,
	[UserRoles.MANAGER]: UserRoles.MANAGER,
	[UserRoles.USER]: UserRoles.USER
};

export interface UserCreateData {
	username: string;
	password: string;
	role: UserRoles;
}
