export class Question {
	public constructor(category: string, type: string, complexity: number, content: string, id?: number, ) {
		this.id = id;
		this.category = category;
		this.type = type;
		this.complexity = complexity;
		this.content = content;
	}

	id: number;
	category: string;
	type: string;
	complexity: number;
	content: string;
	vacancyQuestionId: number;
}