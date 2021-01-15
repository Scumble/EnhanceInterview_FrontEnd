import { Status } from '@app/constants/status';

export class Interview {
	id: number;
	vacancyId: number;
	applicantId: number;
	vacancyTitle: string;
	applyDate: Date;
	interviewDate: Date;
	rejectDate: Date;
	rejectReason: string;
	status: Status;
	interviewRoom: string;

	constructor(
		vacancyId: number,
		applicantId: number,
		status: Status,
		id?: number,
		applyDate?: Date,
		interviewDate?: Date,
		rejectDate?: Date,
		rejectReason?: string,
		interviewRoom?: string
	) 
	{
		this.id = id;
		this.vacancyId = vacancyId;
		this.applicantId = applicantId;
		this.applyDate = applyDate;
		this.interviewDate = interviewDate;
		this.rejectDate = rejectDate;
		this.rejectReason = rejectReason;
		this.interviewRoom = interviewRoom;
		this.status = status;
	}
}