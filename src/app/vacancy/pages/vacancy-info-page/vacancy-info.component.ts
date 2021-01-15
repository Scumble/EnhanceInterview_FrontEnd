import { Component, OnInit } from '@angular/core';
import { VacancyService } from '../../services/vacancy.service';
import { Vacancy } from '../../models/vacancy.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from '@app/interview/services/interview.service';
import { Interview } from '@app/interview/models/interview.model';
import { ApplicantService } from '@app/applicant/services/applicant.service';
import { Status } from '@app/constants/status';
import { NotificationService } from '@app/shared/notification/notification.service';

@Component({ templateUrl: 'vacancy-info.component.html'})
export class VacancyInfoComponent implements OnInit {
	public vacancyId: number;
	public currentUser: Login;
	public vacancy: Vacancy;
	public interview: Interview;
	private applicantId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private applicantService: ApplicantService,
		private interviewService: InterviewService,
		private authenticationService: AuthenticationService,
		private vacancyService: VacancyService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["vacancyId"]) {
			this.vacancyId = this.activatedRoute.snapshot.params["vacancyId"];  
		}
	}

	ngOnInit(): void {
		this.getApplicantByUserId(this.currentUser && this.currentUser.userId);
		this.getVacancyById(this.vacancyId);
	}

	public applyToVacancy() {
		if (this.roles.isApplicant) {
			let interview = new Interview(this.vacancyId, this.applicantId, Status.APPLIED);

			this.interviewService.applyToInterview(interview)
				.pipe(takeUntil(this.unsubscribe))
				.subscribe(() => {
					this.router.navigate(["/interviews"]);
					this.notificationService.showSuccess("Success!!", "You have applied to vacancy.");
				});
		}
	}

	public getInterviewByApplicantId(applicantId: number): void {
		this.interviewService.getInterviewByApplicantId(applicantId, this.vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(interview => {
				this.interview = interview;
			});
	}

	private getApplicantByUserId(userId: string): void {
		this.applicantService.getApplicantByUserId(userId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(applicant => {
				this.applicantId = applicant && applicant.id;
				this.getInterviewByApplicantId(this.applicantId);
			})
	}

	private getVacancyById(vacancyId: number): void {
		this.vacancyService.getVacancyById(vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(vacancy => {
				this.vacancy = vacancy;
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}