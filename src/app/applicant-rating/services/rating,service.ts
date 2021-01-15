import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Rating } from '../models/rating.model';
import { VacancyRating } from '../models/vacany-rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
	constructor(private http: HttpClient) {}

	getInterviewRatings(applicantId: number): Observable<Rating[]> {
		return this.http.get<Rating[]>(`${environment.apiUrl}/rating/applicant/${applicantId}`);
	}

	getVacancyRatings(vacancyId: number): Observable<VacancyRating[]> {
		return this.http.get<VacancyRating[]>(`${environment.apiUrl}/rating/vacancy/${vacancyId}`);
	}
}