import { AuthorizationBase } from './authorization-base';

export class Registration extends AuthorizationBase {

	public constructor(init?: Partial<Registration>) {
		super();
		Object.assign(this, init);
	}

	companyName: string;
}