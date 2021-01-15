export class ChatMessage {
	constructor(userName: string, message: string, sendTime: Date) {
		this.userName = userName;
		this.message = message;
		this.sendTime = sendTime;
	}

	userName: string;
	message: string;
	sendTime: Date;
}