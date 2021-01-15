export class VacancyQuestion {
	constructor(vacancyId: number, questionId: number) {
		this.vacancyId = vacancyId;
		this.questionId = questionId;
	}

	id: number;
	vacancyId: number;
	questionId: number;
}