import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { Result } from '../models/result.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
	constructor(private http: HttpClient) {}

	getQuestionsByVacancyId(vacancyId: number, category?: string, searchString?: string): Observable<Question[]> {
		let params = new HttpParams();

		if (searchString && category) {
			params = params.append('searchString', searchString).append('category', category);
		}
		else {
			if (searchString) {
				params = params.append('searchString', searchString);
			}

			if (category) {
				params = params.append('category', category);
			}
		}

		return this.http.get<Question[]>(`${environment.apiUrl}/questions/vacancy/${vacancyId}`, {params: params});
	}

	getInterviewResultsByInterviewId(interviewId: number, category?: string, searchString?: string): Observable<Result[]> {
		let params = new HttpParams();

		if (searchString && category) {
			params = params.append('searchString', searchString).append('category', category);
		}
		else {
			if (searchString) {
				params = params.append('searchString', searchString);
			}

			if (category) {
				params = params.append('category', category);
			}
		}

		return this.http.get<Result[]>(`${environment.apiUrl}/answers/interview/${interviewId}`, {params: params});
	}

	getQuestionsById(questionId: number): Observable<Question> {
		return this.http.get<Question>(`${environment.apiUrl}/questions/${questionId}`);
	}

	createQuestion(question: Question, vacancyId: number): Observable<Question> {
		return this.http.post<Question>(`${environment.apiUrl}/questions/vacancy/${vacancyId}`, question);
	}

	updateQuestion(question: Question): Observable<Question> {
		return this.http.put<Question>(`${environment.apiUrl}/questions`, question);
	}

	deleteQuestion(questionId: number, vacancyId: number): Observable<Question> {
		return this.http.delete<Question>(`${environment.apiUrl}/questions/${questionId}/vacancy/${vacancyId}`);
	}

	addQuestionAnswer(answer: Answer): Observable<Answer> {
		return this.http.post<Answer>(`${environment.apiUrl}/answers/`, answer);
	}
}