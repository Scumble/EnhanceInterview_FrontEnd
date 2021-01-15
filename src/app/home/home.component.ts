import { Component } from '@angular/core';
import { Login } from '@app/authorization/models/login';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { SignalRService } from '@app/shared/signalRHub/signalR.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { Globals } from '@app/shared/globals';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
	currentUser: Login;

	constructor(
		private roles: Globals,
		private authenticationService: AuthenticationService,
		private signalRService: SignalRService,
		private notificationService : NotificationService)
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit() {
		// this.applyToVacancySignal();
		// this.interviewAcceptSignal();
	};

	private applyToVacancySignal(): void {
		this.signalRService.applyToVacancySignalReceived.subscribe(() => {
			if (this.roles.isRecruiter) {
				this.notificationService.showSuccess("New applicant!!", "Applicant have applied to vacancy");
			}
		})
	}

	private interviewAcceptSignal(): void {
		this.signalRService.interviewAcceptSignalReceived.subscribe(() => {
			if (this.roles.isApplicant) {
				this.notificationService.showSuccess("Congratulations!!", "You have been accepted to interview");
			}
		})
	}
}
