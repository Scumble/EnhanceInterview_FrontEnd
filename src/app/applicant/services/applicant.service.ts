import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Applicant } from '../models/applicant.model';

@Injectable({ providedIn: 'root' })
export class ApplicantService {
	constructor(private http: HttpClient) {}

	getApplicantByUserId(userId: string): Observable<Applicant> {
		return this.http.get<Applicant>(`${environment.apiUrl}/applicant/user/${userId}`);
	}

	getApplicantById(id: number): Observable<Applicant> {
		return this.http.get<Applicant>(`${environment.apiUrl}/applicant/${id}`);
	}

	updateApplicant(applicant: Applicant): Observable<Applicant> {
		return this.http.put<Applicant>(`${environment.apiUrl}/applicant`, applicant);
	}
}