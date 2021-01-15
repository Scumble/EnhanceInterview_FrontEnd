import { Component, OnInit } from '@angular/core';
import { VacancyService } from '../services/vacancy.service';
import { Vacancy } from '../models/vacancy.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Roles } from '@app/constants/roles';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ApplicantService } from '@app/applicant/services/applicant.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from '@app/interview/models/interview.model';

@Component({ templateUrl: 'vacancy.component.html'})
export class VacancyComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public vacancies: Vacancy[];
	public interviews = new Array<Interview>();
	public pageOfItems: any[];
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private confirmationDialogService: ConfirmationDialogService,
		private authenticationService: AuthenticationService,
		private applicantService: ApplicantService,
		private vacancyService: VacancyService,
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

		this.getVacancies();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getVacancies(this.searchTerm);
	}

	public getVacancies(searchString?: string): void {
		let userId = this.currentUser && this.currentUser.userId;
		if (this.currentUser.role === Roles.APPLICANT) {
			this.getVacanciesForApplicantByUserId(userId, searchString)
		}
		else {
			this.getVacanciesByCompanyId(this.currentUser.companyId, searchString);
		}

		const queryParams = {
			searchString: searchString
		}

		this.router.navigate(['/vacancies'], {queryParams})
	}

	public openDeletionDialog(vacancyId: number): void {
		this.confirmationDialogService.confirm(
			'Please confirm the deletion',
			`Do you really want to delete the vacancy with №: ${vacancyId}?`)
				.then((confirmed) => {
					 if (confirmed) {
						this.deleteVacancy(vacancyId);
					}})
	}

	private getVacanciesForApplicant(applicantId: number, searchString: string): void {
		this.vacancyService.getVacanciesForApplicant(applicantId, searchString)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(vacancies => {
				this.vacancies = vacancies;
			})
	}

	private getVacanciesForApplicantByUserId(userId: string, searchString: string) {
		this.applicantService.getApplicantByUserId(userId)
			.subscribe(applicant => {
				this.getVacanciesForApplicant(applicant.id, searchString);
			})
	}

	private getVacanciesByCompanyId(companyId: number, searchString: string): void {
		this.vacancyService.getVacanciesByCompanyId(companyId, searchString)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(vacancies => {
				this.vacancies = vacancies;
			})
	}

	private deleteVacancy(vacancyId: number): void {
		this.vacancyService.deleteVacancy(vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(data => {
				this.getVacancies();
				this.notificationService.showError("Success!!", "Vacancy has been deleted");
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}