import { Roles } from '@app/constants/roles';

export class AuthorizationBase {
	userId: string;
	firstName: string;
	lastName: string;
	login: string;
	password: string;
	email: string;
	role: Roles;
}