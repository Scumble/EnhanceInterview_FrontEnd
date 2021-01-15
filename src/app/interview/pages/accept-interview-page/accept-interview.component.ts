import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({ templateUrl: 'accept-interview.component.html'})
export class AcceptInterviewComponent implements OnInit {
	public interviewForm: FormGroup;
	public currentUser: Login;
	public interviewId: number;
	public submitted: boolean = false;
	public error: string = '';
	public currentDate: string = new Date().toISOString().substring(0, 16);
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private interviewService: InterviewService,
		private notificationService : NotificationService
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

	get f() { return this.interviewForm.controls; }

	private initInterviewForm(): void {
		this.interviewForm = this.formBuilder.group({
			id: ['', Validators.required],
			vacancyId: ['', Validators.required],
			applicantId: ['', Validators.required],
			status: ['', Validators.required],
			applyDate: ['', Validators.required],
			interviewDate: ['', Validators.required]
		});
	}

	private fillInterviewForm(): void {
		let datePicker = new DatePipe('en-Us');
		this.interviewService.getInterviewById(this.interviewId)
			.subscribe(interview => this.interviewForm.patchValue({
				id: interview['id'],
				vacancyId: interview['vacancyId'],
				applicantId: interview['applicantId'],
				status: this.roles.isRecruiter ? Status.WAITING_FOR_APPLICANT_ACCEPT : Status.ACCEPTED,
				applyDate: datePicker.transform(interview['applyDate'], 'yyyy-MM-ddTHH:mm'),
				interviewDate: datePicker.transform(interview['interviewDate'], 'yyyy-MM-ddTHH:mm'),
				rejectDate: null,
				rejectReason: null
			}));
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.interviewForm.invalid) {
			return;
		}

		this.updateInterview();

		if (this.roles.isRecruiter) {
			this.notificationService.showSuccess("Success!!", "You have accepted new applicant to interview");
		}
		else if (this.roles.isApplicant) {
			this.notificationService.showSuccess("Success!!", "You have accept the interview");
		}
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
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}