import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Rating } from '../models/rating.model';
import { RatingService } from '../services/rating,service';
import { ApplicantService } from '@app/applicant/services/applicant.service';
import { CompanyService } from '@app/company/services/company.service';

@Component({ templateUrl: 'rating.component.html'})
export class RatingComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public ratingList: Rating[];
	public pageOfItems: any[];
	public companyId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private ratingService: RatingService,
		private applicantService: ApplicantService,
		private companyService: CompanyService,
		private router: Router)
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit(): void {
		this.getRating();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public getCompany(companyName: string): void {
		this.companyService.getCompanyByName(companyName)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((company) => {
				this.router.navigate(["/companies/", company.id]);
			});
	}

	private getRating(): void {
		this.applicantService.getApplicantByUserId(this.currentUser.userId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(applicant => {
				this.getInterviewRatings(applicant.id);
			})
	}

	private getInterviewRatings(applicantId: number): void {
		this.ratingService.getInterviewRatings(applicantId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(ratingList => {
				this.ratingList = ratingList;
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}