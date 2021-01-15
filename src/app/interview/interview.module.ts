import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { InterviewComponent } from './pages/interview.component';
import { InterviewRoutingModule } from './interview-routing.module';
import { AcceptInterviewComponent } from './pages/accept-interview-page/accept-interview.component';
import { RejectInterviewComponent } from './pages/reject-interview-page/reject-interview.component';

@NgModule({
	imports: [
		SharedModule,
		InterviewRoutingModule
	],
	declarations: [
		InterviewComponent,
		AcceptInterviewComponent,
		RejectInterviewComponent
	]
})

export class InterviewModule { }