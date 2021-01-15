import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from '@app/interview/models/interview.model';
import { Company } from '@app/company/models/company';
import { CompanyService } from '@app/company/services/company.service';

@Component({ templateUrl: 'company-info.component.html'})
export class CompanyInfoComponent implements OnInit {
	public companyId: number;
	public currentUser: Login;
	public company: Company;
	public interview: Interview;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private activatedRoute: ActivatedRoute,
		private companyService: CompanyService,
		private authenticationService: AuthenticationService) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["companyId"]) {
			this.companyId = this.activatedRoute.snapshot.params["companyId"];  
		}
	}

	ngOnInit(): void {
		this.getCompanyById(this.companyId);
	}

	private getCompanyById(companyId: number): void {
		this.companyService.getCompanyById(companyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(company => {
				this.company = company;
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}