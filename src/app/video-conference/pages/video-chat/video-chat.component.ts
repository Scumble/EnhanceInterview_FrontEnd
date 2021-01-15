import { Component, OnInit, Input } from '@angular/core';
import { ChatSignalRService } from '@app/shared/signalRHub/chatSignalR.service';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { ChatMessage } from '@app/shared/signalRHub/interfaces/chatMessage.model';

@Component({
  selector: 'video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['video-chat.component.scss']
})
export class VideoChatComponent implements OnInit {
	public message = '';
	public messages: ChatMessage[] = [];
	public userName: string;
	public userNames: string[] = [];
	public editorOptions = {theme: 'vs-dark', language: 'javscript'};
	public isCodeEditorVisible: boolean = false;
	@Input() roomName: string;

	constructor(
		public chatSignalRService: ChatSignalRService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {
		this.userName = this.authenticationService.getUserName();

		this.chatSignalRService.getMessageObservable().subscribe(message => {
			this.messages = message;
		});
	}

	public showCodeEditor(): void {
		this.isCodeEditorVisible = true;
	}

	public hideCodeEditor(): void {
		this.isCodeEditorVisible = false;
	}

	public sendMessage(): void {
		this.chatSignalRService.sendMessage(this.message, this.userName, this.roomName);
	}
}