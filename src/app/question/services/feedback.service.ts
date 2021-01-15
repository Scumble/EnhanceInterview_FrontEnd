import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Feedback } from '../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
	constructor(private http: HttpClient) {}

	getApplicantFeedbacks(interviewId: number): Observable<Feedback[]> {
		return this.http.get<Feedback[]>(`${environment.apiUrl}/feedbacks/interview/${interviewId}`);
	}

	updateFeedback(feedback: Feedback): Observable<Feedback> {
		return this.http.put<Feedback>(`${environment.apiUrl}/feedbacks`, feedback);
	}

	deleteFeedback(feedbackId: number): Observable<Feedback> {
		return this.http.delete<Feedback>(`${environment.apiUrl}/feedbacks/${feedbackId}`);
	}

	addFeedback(feedback: Feedback): Observable<Feedback> {
		return this.http.post<Feedback>(`${environment.apiUrl}/feedbacks`, feedback);
	}
}