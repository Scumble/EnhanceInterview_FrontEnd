import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Interview } from '@app/interview/models/interview.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InterviewService } from '@app/interview/services/interview.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '@app/shared/globals';
import { NotificationService } from '@app/shared/notification/notification.service';
import * as uuid from 'uuid';

@Component({templateUrl: 'create-video-conference.component.html'})
export class CreateVideoConferenceComponent implements OnInit {
	public currentUser: Login;
	public joined: boolean = false;
	public interviewForm: FormGroup;
	public interviewRoom: string = '';
	private interviewId: number;

	constructor(
		public roles: Globals,
		private authenticationService: AuthenticationService,
		private interviewService: InterviewService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
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
			this.interviewRoom
		);

		this.interviewService.updateInterview(interview).subscribe(() => {
			this.router.navigate(["/interviews"]);
			if (this.roles.isRecruiter) {
				this.notificationService.showSuccess("Success!!", "You have created the room for video conference");
			}
		});
	}

	public generateRoomName(): void {
		const guid = uuid.v4();
		this.interviewRoom = guid;
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
			rejectReason: ['']
		});
	}

	private fillInterviewForm(): void {
		let datePicker = new DatePipe('en-Us');
		this.interviewService.getInterviewById(this.interviewId)
			.subscribe(interview => this.interviewForm.patchValue({
				id: interview['id'],
				vacancyId: interview['vacancyId'],
				applicantId: interview['applicantId'],
				status: interview['status'],
				applyDate: datePicker.transform(interview['applyDate'], 'yyyy-MM-ddTHH:mm'),
				interviewDate: datePicker.transform(interview['interviewDate'], 'yyyy-MM-ddTHH:mm'),
				rejectDate: datePicker.transform(interview['rejectDate'], 'yyyy-MM-ddTHH:mm'),
				rejectReason: interview.rejectReason
			}));
	}
}