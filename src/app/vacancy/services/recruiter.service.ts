import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Recruiter } from '../models/recruiter.model';

@Injectable({ providedIn: 'root' })
export class RecruiterService {
	constructor(private http: HttpClient) {}

	getRecruiterByUserId(userId: string): Observable<Recruiter> {
		return this.http.get<Recruiter>(`${environment.apiUrl}/recruiters/user/${userId}`);
	}
}