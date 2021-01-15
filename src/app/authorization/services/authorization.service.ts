import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@app/../environments/environment';
import { Login } from '../models/login';
import {  Registration } from '../models/registration';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<Login>;
	public currentUser: Observable<Login>;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): Login {
		return this.currentUserSubject.value;
	 }

	login(login: string, password: string): Observable<Login> {
		return this.http.post<any>(`${environment.apiUrl}/login`, { login, password })
			.pipe(map(user => {
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
				return user;
			}));
	}

	register(user: Registration): Observable<Registration> {
		return this.http.post<any>(`${environment.apiUrl}/register`, user);
	}

	logout() {
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	getUserName(): string {
		return `${this.currentUserValue.firstName} ${this.currentUserValue.lastName} (${this.currentUserValue.role})`;
	}
}