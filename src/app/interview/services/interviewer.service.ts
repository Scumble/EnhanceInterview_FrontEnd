import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';

@Injectable({ providedIn: 'root' })
export class InterviewerService {
	constructor(private http: HttpClient) {}

	getInterviewerByUserId(userId: string): Observable<Interviewer> {
		return this.http.get<Interviewer>(`${environment.apiUrl}/interviewer/user/${userId}`);
	}
}

export class Interviewer {
	id: number;
	workerId: number;
}