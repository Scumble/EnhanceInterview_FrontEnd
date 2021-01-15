import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Vacancy } from '../models/vacancy.model';

@Injectable({ providedIn: 'root' })
export class VacancyService {
	constructor(private http: HttpClient) {

	}

	getVacanciesForApplicant(applicantId: number, searchString?: string): Observable<Vacancy[]> {
		let params = new HttpParams();
		if (searchString) {
			params = params.append('searchString', searchString);
		}

		return this.http.get<Vacancy[]>(`${environment.apiUrl}/vacancies/applicant/${applicantId}`, { params: params });
	}

	getVacanciesByCompanyId(companyId: number, searchString?: string): Observable<Vacancy[]> {
		let params = new HttpParams();
		if (searchString) {
			params = params.append('searchString', searchString);
		}
		return this.http.get<Vacancy[]>(`${environment.apiUrl}/vacancies/company/${companyId}`, { params: params });
	}

	getVacancyById(vacancyId: number): Observable<Vacancy> {
		return this.http.get<Vacancy>(`${environment.apiUrl}/vacancies/${vacancyId}`);
	}

	createVacancy(vacancy: Vacancy): Observable<Vacancy> {
		return this.http.post<Vacancy>(`${environment.apiUrl}/vacancies`, vacancy);
	}

	updateVacancy(vacancy: Vacancy): Observable<Vacancy> {
		return this.http.put<Vacancy>(`${environment.apiUrl}/vacancies`, vacancy);
	}

	deleteVacancy(vacancyId: number): Observable<Vacancy> {
		return this.http.delete<Vacancy>(`${environment.apiUrl}/vacancies/${vacancyId}`);
	}
}