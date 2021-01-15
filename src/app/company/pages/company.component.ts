import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../models/company';
import { CompanyService } from '../services/company.service';

@Component({ templateUrl: 'company.component.html'})
export class CompanyComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public companies: Company[];
	public pageOfItems: any[];
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private confirmationDialogService: ConfirmationDialogService,
		private authenticationService: AuthenticationService,
		private companyService: CompanyService,
		private notificationService : NotificationService,
		private route: ActivatedRoute,
		private router: Router
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.searchTerm = params['searchString'];
		});

		this.getCompanies();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getCompanies(this.searchTerm);
	}

	public getCompanies(searchString?: string): void {
		this.companyService.getCompanies()
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(companies => {
				this.companies = companies;
			});

		const queryParams = {
			searchString: searchString
		}

		this.router.navigate(['/companies'], {queryParams})
	}

	public openDeletionDialog(companyId: number): void {
		this.confirmationDialogService.confirm(
			'Please confirm the deletion',
			`Do you really want to delete the company with №: ${companyId}?`)
				.then((confirmed) => {
					 if (confirmed) {
						this.deleteCompany(companyId);
					}})
	}

	private deleteCompany(vacancyId: number): void {
		this.companyService.deleteCompany(vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(data => {
				this.getCompanies();
				this.notificationService.showError("Success!!", "Company has been deleted");
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}