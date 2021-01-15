import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ChatMessage } from './interfaces/chatMessage.model';

@Injectable({ providedIn: 'root' })
export class ChatSignalRService {
	public codeText: string;
	private messageSub = new BehaviorSubject<ChatMessage[]>([]);
	private messageObservable: Observable<ChatMessage[]>;
	private _hubConnection: HubConnection;
	private messages: ChatMessage[] = [];

	constructor() {
		this._hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(`${environment.signalRUrl}/chatSignal`)
			.configureLogging(signalR.LogLevel.Information)
			.build();

		this._hubConnection.start().catch(err => console.error(err.toString()));

		this._hubConnection.on('Send', (message: string, userName: string, sendTime: Date) => {
			let chatMessage = new ChatMessage(userName, message, sendTime);

			this.messages.push(chatMessage);
			this.messageSub.next(this.messages);
		});

		this._hubConnection.on("UpdateCodeEditor", (codeText) => {
			this.codeText = codeText;
		});
	}

	public getMessageObservable(): Observable<ChatMessage[]> {
		if (!this.messageObservable) {
			this.messageObservable = this.messageSub.asObservable();
		}

		return this.messageObservable;
	}

	public sendMessage(message: string, userName: string, groupName: string): void {
		if (this._hubConnection) {
			this._hubConnection.invoke('Send', message, userName, groupName);
		}
	}

	public enterChat(userName: string, groupName: string): void {
		if (this._hubConnection) {
			this._hubConnection.invoke('EnterChat', userName, groupName);
		}
	}

	public updateCodeEditor(groupName: string): void {
		this._hubConnection.invoke("UpdateCodeEditor", this.codeText, groupName);
	}
}