import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Feedback } from '@app/question/models/feedback.model';
import { FeedbackService } from '@app/question/services/feedback.service';

@Component({ templateUrl: 'feedback.component.html'})
export class FeedbackComponent implements OnInit {
	public currentUser: Login;
	public feedbacks: Feedback[];
	public interviewId: number;
	public category: string = "";
	public pageOfItems: any[];
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private confirmationDialogService: ConfirmationDialogService,
		private authenticationService: AuthenticationService,
		private notificationService : NotificationService,
		private feedbackService: FeedbackService,
		private route: ActivatedRoute,
		private router: Router
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.route.snapshot.params["interviewId"]) {
			this.interviewId = this.route.snapshot.params["interviewId"];  
		}
	}

	ngOnInit(): void {
		this.getApplicantFeedbacks();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	private getApplicantFeedbacks(): void {
		this.feedbackService.getApplicantFeedbacks(this.interviewId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(feedbacks => {
				this.feedbacks = feedbacks;
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}