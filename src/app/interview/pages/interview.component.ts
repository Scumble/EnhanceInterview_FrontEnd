import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Roles } from '@app/constants/roles';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { Interview } from '../models/interview.model';
import { InterviewService } from '../services/interview.service';
import { ApplicantService } from '@app/applicant/services/applicant.service';
import { SignalRService } from '@app/shared/signalRHub/signalR.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Status } from '@app/constants/status';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({ templateUrl: 'interview.component.html'})
export class InterviewComponent implements OnInit {
	public currentUser: Login;
	public interviewForm: FormGroup;
	public interviews: Interview[];
	public pageOfItems: any[];
	public submitted: boolean = false;
	public searchTerm: string = "";
	public selectedStatus: string = "";
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private applicantService: ApplicantService,
		private signalRService: SignalRService,
		private confirmationDialogService: ConfirmationDialogService,
		private authenticationService: AuthenticationService,
		private interviewService: InterviewService,
		private notificationService : NotificationService,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.searchTerm = params['searchString'];
		});

		this.getInterviews();
		this.applyToVacancySignal();
		this.interviewAcceptSignal();
		this.initInterviewForm();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public onStatusChange(status: string): void {
		this.selectedStatus = status;
		this.getInterviews(this.searchTerm, this.selectedStatus);
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getInterviews(this.searchTerm, this.selectedStatus);
	}

	public enableAcceptButton(interview: Interview): boolean {
		if (this.roles.isApplicant) {
			return interview.status === Status.WAITING_FOR_APPLICANT_ACCEPT;
		}
		else if (this.roles.isRecruiter) {
			return interview.status === Status.APPLIED || interview.status === Status.REJECTED;
		}
		else {
			return false;
		}
	}

	public enableRejectButton(interview: Interview): boolean {
		if (this.roles.isApplicant) {
			return interview.status === Status.WAITING_FOR_APPLICANT_ACCEPT ||
			interview.status === Status.ACCEPTED;
		}
		else if (this.roles.isRecruiter) {
			return interview.status === Status.WAITING_FOR_APPLICANT_ACCEPT ||
			interview.status === Status.ACCEPTED ||
			interview.status === Status.APPLIED;
		}
		else {
			return false;
		}
	}

	public enableCreateInterviewButton(interview: Interview): boolean {
		if (this.roles.isRecruiter) {
			return !interview.interviewRoom && interview.status === Status.ACCEPTED;
		}
	}

	public enableEnterInterviewButton(interview: Interview): boolean {
		return interview.interviewRoom && interview.status === Status.ACCEPTED;
	}

	public enableEndInterviewButton(interview: Interview): boolean {
		if (this.roles.isRecruiter) {
			return interview.interviewRoom && interview.status === Status.ACCEPTED;
		}
	}

	public enableViewResultsButton(interview: Interview): boolean {
		return interview && interview.status === Status.COMPLETED;
	}

	public endInterview(interviewId: number): void {
		this.fillInterviewForm(interviewId);

		this.confirmationDialogService.confirm(
			'Please confirm the completion of interview',
			'Are you sure that you want to end this interview')
				.then((confirmed) => {
					 if (confirmed) {
						this.updateInterview();
					}})
	}

	public getInterviews(searchString?: string, status?: string): void {
		if (this.roles.isApplicant) {
			this.getApplicantInterviews(searchString, status);
		}
		else if (this.roles.isRecruiter) {
			this.getInterviewsByCompanyId(this.currentUser && this.currentUser.companyId, searchString, status);
		}
		else {
			this.getAcceptedInterviewsByCompanyId(this.currentUser && this.currentUser.companyId, searchString, status);
		}

		const queryParams = {
			searchString: searchString,
			status: status
		}

		this.router.navigate(['/interviews'], {queryParams})
	}

	
	private initInterviewForm(): void {
		this.interviewForm = this.formBuilder.group({
			id: [''],
			vacancyId: [''],
			applicantId: [''],
			status: [''],
			applyDate: [''],
			interviewDate: [''],
			rejectDate: [''],
			rejectReason: [''],
			interviewRoom: ['']
		});
	}

	private fillInterviewForm(interviewId: number): void {
		let datePicker = new DatePipe('en-Us');
		this.interviewService.getInterviewById(interviewId)
			.subscribe(interview => this.interviewForm.patchValue({
				id: interview['id'],
				vacancyId: interview['vacancyId'],
				applicantId: interview['applicantId'],
				status: Status.COMPLETED,
				applyDate: datePicker.transform(interview['applyDate'], 'yyyy-MM-ddTHH:mm'),
				interviewDate: interview['interviewDate'],
				rejectDate: datePicker.transform(interview['rejectDate'], 'yyyy-MM-ddTHH:mm'),
				rejectReason: interview['rejectReason'],
				interviewRoom: null
			}));
	}

	public updateInterview(): void {
		let interview = new Interview(
			this.interviewForm.value.vacancyId,
			this.interviewForm.value.applicantId,
			this.interviewForm.value.status,
			this.interviewForm.value.id,
			this.interviewForm.value.applyDate,
			this.interviewForm.value.interviewDate,
			this.interviewForm.value.rejectDate,
			this.interviewForm.value.rejectReason,
			this.interviewForm.value.interviewRoom
		);

		this.interviewService.updateInterview(interview)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => {
				this.getInterviews();
				this.notificationService.showSuccess("Success!!", "You have completed the interview");
			})
	}

	private filterAcceptedInterviews(interviews: Interview[]): Interview[] {
		return interviews.filter(x => x.status === Status.ACCEPTED || x.status === Status.COMPLETED);
	}

	private applyToVacancySignal(): void {
		if (this.roles.isRecruiter) {
			this.signalRService.applyToVacancySignalReceived.subscribe((interview: Interview) => {
				this.interviews.push(interview);
				this.getInterviews();
			})
		}
	}

	private interviewAcceptSignal(): void {
		if (this.roles.isApplicant) {
			this.signalRService.interviewAcceptSignalReceived.subscribe(() => {
				this.getInterviews();
			})
		}
	}

	private getAcceptedInterviewsByCompanyId(companyId: number, searchString?: string, status?: string): void {
		this.interviewService.getInterviewsByCompanyId(companyId, searchString, status)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(interviews => {
				this.interviews = this.filterAcceptedInterviews(interviews);
			});
	}

	private getInterviewsByCompanyId(companyId: number, searchString?: string, status?: string): void {
		this.interviewService.getInterviewsByCompanyId(companyId, searchString, status)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(interviews => {
				this.interviews = interviews;
			});
	}

	private getAppliedInterviews(applicantId: number, searchString?: string, status?: string): void {
		this.interviewService.getAppliedInterviews(applicantId, searchString, status)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(interviews => {
				this.interviews = interviews;
			});
	}

	private getApplicantInterviews(searchString?: string, status?: string) {
		this.applicantService.getApplicantByUserId(this.currentUser && this.currentUser.userId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(applicant => {
				this.getAppliedInterviews(applicant.id, searchString, status);
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}