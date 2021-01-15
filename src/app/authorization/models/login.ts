import { AuthorizationBase } from './authorization-base';

export class Login extends AuthorizationBase {
	companyId: number;
	token: number;
}