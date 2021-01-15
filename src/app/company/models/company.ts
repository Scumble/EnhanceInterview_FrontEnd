export class Company {
	public constructor(init?: Partial<Company>) {
		Object.assign(this, init);
	}

	public id: number;
	public name: string;
	public description: string;
	public location: string;
}