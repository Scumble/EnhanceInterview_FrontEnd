export class Answer {
	constructor(vacancyQuestionId: number, interviewId: number, estimation: number) {
		this.vacancyQuestionId = vacancyQuestionId;
		this.interviewId = interviewId;
		this.estimation = estimation;
	}

	id: number;
	vacancyQuestionId: number;
	interviewId: number;
	estimation: number;
}