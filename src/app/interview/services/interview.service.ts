import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Interview } from '../models/interview.model';

@Injectable({ providedIn: 'root' })
export class InterviewService {
	constructor(private http: HttpClient) {}

	getInterviewsByCompanyId(companyId: number, searchString?: string, status?: string): Observable<Interview[]> {
		let params = new HttpParams();
		if (searchString && status) {
			params = params.append('searchString', searchString).append('status', status);
		}
		else {
			if (searchString) {
				params = params.append('searchString', searchString);
			}

			if (status) {
				params = params.append('status', status);
			}
		}

		return this.http.get<Interview[]>(`${environment.apiUrl}/interviews/company/${companyId}`, {params: params});
	}

	getAppliedInterviews(applicantId: number, searchString?: string, status?: string): Observable<Interview[]> {
		let params = new HttpParams();
		if (searchString && status) {
			params = params.append('searchString', searchString).append('status', status);
		}
		else {
			if (searchString) {
				params = params.append('searchString', searchString);
			}

			if (status) {
				params = params.append('status', status);
			}
		}

		return this.http.get<Interview[]>(`${environment.apiUrl}/interviews/applicant/${applicantId}`, {params: params});
	}

	getInterviewById(interviewId: number): Observable<Interview> {
		return this.http.get<Interview>(`${environment.apiUrl}/interview/${interviewId}`);
	}

	getInterviewByVacancyId(vacancyId: number): Observable<Interview> {
		return this.http.get<Interview>(`${environment.apiUrl}/interview/vacancy/${vacancyId}`);
	}

	getInterviewByApplicantId(applicantId: number, vacancyId: number): Observable<Interview> {
		return this.http.get<Interview>(`${environment.apiUrl}/interview/applicant/${applicantId}/vacancy/${vacancyId}`);
	}

	applyToInterview(interview: Interview): Observable<Interview> {
		return this.http.post<Interview>(`${environment.apiUrl}/interview`, interview);
	}

	updateInterview(interview: Interview): Observable<Interview> {
		return this.http.put<Interview>(`${environment.apiUrl}/interview`, interview);
	}
}