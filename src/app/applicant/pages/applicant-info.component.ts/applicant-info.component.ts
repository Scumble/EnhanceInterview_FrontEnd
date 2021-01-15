import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '@app/applicant/services/applicant.service';
import { Applicant } from '@app/applicant/models/applicant.model';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'applicant-info.component.html'})
export class ApplicantInfoComponent implements OnInit {
	public currentUser: Login;
	public applicant: Applicant;
	public applicantId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private activatedRoute: ActivatedRoute,
		private applicantService: ApplicantService,
		private authenticationService: AuthenticationService,
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["applicantId"]) {
			this.applicantId = this.activatedRoute.snapshot.params["applicantId"];  
		}
	}

	ngOnInit(): void {
		this.getApplicantById();
	}

	public createImagePath(imagePath: string): string {
		return `${environment.signalRUrl}/${imagePath}`;
	}

	private getApplicantById(): void {
		this.applicantService.getApplicantById(this.applicantId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(applicant => {
				this.applicant = applicant;
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}