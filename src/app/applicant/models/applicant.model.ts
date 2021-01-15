export class Applicant {
	public constructor(init?: Partial<Applicant>) {
		Object.assign(this, init);
	}

	id: number;
	firstName: string;
	lastName: string;
	userId: string;
	email: string;
	phoneNumber: string;
	information: string;
	skills: string;
	education: string;
	experience: string;
	profileImgPath: string;
	birthDate: Date;
}