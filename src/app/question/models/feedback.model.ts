export class Feedback {
	constructor(interviewId: number, interviewerId: number, content: string) {
		this.interviewId = interviewId;
		this.interviewerId = interviewerId;
		this.content = content;
	}

	id: number;
	interviewId: number;
	interviewerId: number;
	content: string;
	workerId: number;
	firstName: string;
	lastName: string;
	role: string;
	vacancyTitle: string;
}