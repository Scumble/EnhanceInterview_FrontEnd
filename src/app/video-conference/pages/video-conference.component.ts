import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { WebRtcSignalRService, UserConnection, IUser } from '@app/shared/signalRHub/webRtcSignalR.service';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { FormGroup } from '@angular/forms';
import { CanComponentDeactivate } from '@app/shared/services/can-deactivate.service';
import { Observable } from 'rxjs';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { ChatSignalRService } from '@app/shared/signalRHub/chatSignalR.service';

@Component({templateUrl: 'video-conference.component.html', styleUrls:["video-conference.component.scss"]})
export class VideoConferenceComponent implements OnInit, CanComponentDeactivate {
	public currentUser: Login;
	public users: UserConnection[];
	public joined: boolean = false;
	public interviewForm: FormGroup;
	public roomName: string = '';
	public interviewId: number;

	constructor(
		public rtcService: WebRtcSignalRService,
		private authenticationService: AuthenticationService,
		private confirmationDialogService: ConfirmationDialogService,
		private chatSignalRService: ChatSignalRService,
		private activatedRoute: ActivatedRoute
	)
	{
		this.currentUser = this.authenticationService.currentUserValue;

		rtcService.usersObservable.subscribe(users => { 
			this.users = users;
		});

		if (this.activatedRoute.snapshot.params["interviewRoom"]) {
			this.roomName = this.activatedRoute.snapshot.params["interviewRoom"];  
		}

		if (this.activatedRoute.snapshot.params["interviewId"]) {
			this.interviewId = this.activatedRoute.snapshot.params["interviewId"];  
		}
	}

	ngOnInit(): void {}

	public connect(): void {
		this.rtcService.join(this.authenticationService.getUserName(), this.roomName);
		this.chatSignalRService.enterChat(this.authenticationService.getUserName(), this.roomName);
		this.joined = true;
	}

	public getUserConnectionId(user: IUser): string {
		return user.connectionId;
	}

	public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.users) {
			return this.confirmationDialogService.confirm(
				'Please confirm the leave',
				`Are you sure you want to leave the interview? You will be disconnected`)
					.then((confirmed) => {
						if (confirmed) {
							this.rtcService.hangUp();
							return true;
						}
						else {
							return false;
						}
					});
			}
			else 
			{
				return true;
			}
	}
}