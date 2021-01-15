import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import { Company } from '../models/company';

@Injectable({ providedIn: 'root' })
export class CompanyService {
	constructor(private http: HttpClient) {

	}

	getCompanies(searchString?: string): Observable<Company[]> {
		let params = new HttpParams();
		if (searchString) {
			params = params.append('searchString', searchString);
		}

		return this.http.get<Company[]>(`${environment.apiUrl}/companies`, { params: params });
	}

	getCompanyById(companyId: number): Observable<Company> {
		return this.http.get<Company>(`${environment.apiUrl}/companies/${companyId}`);
	}

	getCompanyByName(companyName: string): Observable<Company> {
		return this.http.get<Company>(`${environment.apiUrl}/companies/name/${companyName}`);
	}

	createCompany(company: Company): Observable<Company> {
		return this.http.post<Company>(`${environment.apiUrl}/companies`, company);
	}

	updateCompany(company: Company): Observable<Company> {
		return this.http.put<Company>(`${environment.apiUrl}/companies`, company);
	}

	deleteCompany(companyId: number): Observable<Company> {
		return this.http.delete<Company>(`${environment.apiUrl}/companies/${companyId}`);
	}
}