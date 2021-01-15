import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@app/shared/notification/notification.service';
import { InterviewService } from '@app/interview/services/interview.service';
import { Status } from '@app/constants/status';
import { Interview } from '@app/interview/models/interview.model';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({ templateUrl: 'reject-interview.component.html'})
export class RejectInterviewComponent implements OnInit {
	public interviewForm: FormGroup;
	public currentUser: Login;
	public interviewId: number;
	public submitted: boolean = false;
	public error: string = '';
	private REJECT_MESSAGE_FOR_RECRUITER: string = "Do you really want to reject this applicant?";
	private REJECT_MESSAGE_FOR_APPLICANT: string = "Do you really want to reject this interview?";
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private interviewService: InterviewService,
		private notificationService : NotificationService,
		private confirmationDialogService: ConfirmationDialogService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["interviewId"]) {
			this.interviewId = this.activatedRoute.snapshot.params["interviewId"];  
		}
	}

	ngOnInit(): void {
		this.initInterviewForm();
		this.fillInterviewForm();
	}

	get f() {
		 return this.interviewForm.controls; 
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.interviewForm.invalid) {
			return;
		}

		this.confirmationDialogService.confirm(
			'Please confirm the reject',
			this.roles.isApplicant ? this.REJECT_MESSAGE_FOR_APPLICANT :this.REJECT_MESSAGE_FOR_RECRUITER)
				.then((confirmed) => {
					 if (confirmed) {
						this.updateInterview();
					}})
	}

	public updateInterview(): void {
		this.submitted = true;

		let interview = new Interview(
			this.interviewForm.value.vacancyId,
			this.interviewForm.value.applicantId,
			this.interviewForm.value.status,
			this.interviewForm.value.id,
			this.interviewForm.value.applyDate,
			this.interviewForm.value.interviewDate,
			this.interviewForm.value.rejectDate,
			this.interviewForm.value.rejectReason
		);

		this.interviewService.updateInterview(interview)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => {
				this.router.navigate(["/interviews"]);
				if (this.roles.isRecruiter) {
					this.notificationService.showError("Success!!", "You have rejected the applicant to interview");
				}
				else if (this.roles.isApplicant) {
					this.notificationService.showError("Success!!", "You have rejected the interview");
				}
			})
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
			rejectReason: ['', Validators.required]
		});
	}

	private fillInterviewForm(): void {
		let datePicker = new DatePipe('en-Us');
		this.interviewService.getInterviewById(this.interviewId)
			.subscribe(interview => this.interviewForm.patchValue({
				id: interview['id'],
				vacancyId: interview['vacancyId'],
				applicantId: interview['applicantId'],
				status: Status.REJECTED,
				applyDate: datePicker.transform(interview['applyDate'], 'yyyy-MM-ddTHH:mm'),
				interviewDate: null,
				rejectDate: datePicker.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
				rejectReason: interview.rejectReason
			}));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}