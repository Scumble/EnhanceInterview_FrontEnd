import { Interview } from '@app/interview/models/interview.model';

export class Vacancy {
	public constructor(init?: Partial<Vacancy>) {
		Object.assign(this, init);
	}

	public id: number;
	public recruiterId: number;
	public title: string;
	public info: string;
	public location: string;
	public startDate: Date;
	public endDate: Date;
	public companyName: string;
	public companyId: number;
	public interview: Interview;
}