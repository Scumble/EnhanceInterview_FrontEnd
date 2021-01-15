import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
	isRecruiter: boolean;
	isApplicant: boolean;
	isDeveloper: boolean;
	isTeamLead: boolean;
	isPsychologist: boolean;
	isHR: boolean;
	isAdmin: boolean;
	remoteStream = new Array<MediaStream>(); //TODO change this
}