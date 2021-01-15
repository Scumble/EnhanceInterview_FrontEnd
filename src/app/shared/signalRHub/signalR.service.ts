import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '@app/../environments/environment';
import * as signalR from "@aspnet/signalr"
import { Interview } from '@app/interview/models/interview.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
	public applyToVacancySignalReceived = new EventEmitter<Interview>();
	public interviewAcceptSignalReceived = new EventEmitter<Interview>();
	private hubConnection: signalR.HubConnection;

	constructor() {
		this.buildConnection();
		this.startConnection();
	}

	public buildConnection = () => {
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(`${environment.signalRUrl}/signal`)
			.build();
	}

	public startConnection = () => {
		this.hubConnection.start().then(() => {
				 console.log("Connection started...")
				 this.registerSignalEvents();
			})
			.catch(err => {
				console.log(`Error while starting connection: ${err}`);

				setTimeout(function() {
					this.startConnection();
				}, 3000)
			});
	}

	private registerSignalEvents() {
		this.applyToVacancySignal();
		this.updateInterviewSignal();
	}

	private applyToVacancySignal(): void {
		this.hubConnection.on("AppliedToVacancy", (data: Interview) => {
			this.applyToVacancySignalReceived.emit(data);
		});
	}

	private updateInterviewSignal(): void {
		this.hubConnection.on("InterviewUpdated", (data: Interview) => {
			this.interviewAcceptSignalReceived.emit(data);
		});
	}
}