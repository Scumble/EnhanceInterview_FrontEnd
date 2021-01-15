import { Component, OnInit, ViewChild, ElementRef, Input, Renderer2 } from '@angular/core';
import { UserConnection, WebRtcSignalRService } from '@app/shared/signalRHub/webRtcSignalR.service';
import { Globals } from '@app/shared/globals';
declare var $: any;

@Component({ selector: 'app-video', templateUrl: './video.component.html', styleUrls:["video.component.scss"] })
export class VideoComponent implements OnInit { //TODO this whole component needs refactoring
	@Input() user: UserConnection;
	@ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
	public microphoneButtonClass: string = "fas fa-microphone";
	public videoButtonClass: string = "fas fa-video";
	public isCurrentUser: boolean = false;
	private currentUserStream: MediaStream;

	constructor(private renderer: Renderer2, private rtcService: WebRtcSignalRService, private globals: Globals) {}

	ngOnInit(): void {
		this.user.streamObservable.subscribe(stream => {
			if (stream && this.videoPlayer) {
				if (this.user.isCurrentUser) {
					this.isCurrentUser = true;
					this.currentUserStream = stream;
					this.renderer.setStyle(this.videoPlayer.nativeElement, 'border', '3px solid lightgreen');
					this.videoPlayer.nativeElement.srcObject = stream;
				}
				else
				{
					this.videoPlayer.nativeElement.srcObject = stream;
				}
			}
		});

		this.user.remoteStreamObservable.subscribe(stream => {
			if (stream) {
				this.globals.remoteStream.push(stream);
			}
		});
	}

	public muteMicrophone(): void {
		if (this.user.isCurrentUser) {
			if (this.videoPlayer.nativeElement.muted === false) {
				this.microphoneButtonClass = "fas fa-microphone-slash muted";
				this.videoPlayer.nativeElement.muted = true;
			}
			else {
				this.microphoneButtonClass = "fas fa-microphone";
				this.videoPlayer.nativeElement.muted = false;
			}
		}
	}

	public disableVideo(): void {
		if (this.user.isCurrentUser) {
			if (this.currentUserStream.getVideoTracks()[0].enabled) {
				this.videoButtonClass = "fas fa-video-slash disabled";
				this.currentUserStream.getVideoTracks()[0].enabled = false;
				for (var i = 0; i < this.globals.remoteStream.length; i++) {
					this.globals.remoteStream[i].getVideoTracks()[0].enabled = false;
				}
			}
			else {
				this.videoButtonClass = "fas fa-video";
				this.currentUserStream.getVideoTracks()[0].enabled = true;
				for (var i = 0; i < this.globals.remoteStream.length; i++) {
					this.globals.remoteStream[i].getVideoTracks()[0].enabled = true;
				}
			}
		}
	}
}