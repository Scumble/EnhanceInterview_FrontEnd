import { RouterModule, Routes }	from '@angular/router';
import { AuthGuard } from '@app/interceptors';
import { Roles } from '@app/constants/roles';
import { NgModule } from '@angular/core';
import { InterviewComponent } from './pages/interview.component';
import { AcceptInterviewComponent } from './pages/accept-interview-page/accept-interview.component';
import { RejectInterviewComponent } from './pages/reject-interview-page/reject-interview.component';

const routes: Routes = [
	{
		path: 'interviews',
		component: InterviewComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Interviews",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Interviews",
					url: ""
				}
			]
		}
	},
	{
		path: 'accept/:interviewId',
		component: AcceptInterviewComponent,
		canActivate: [AuthGuard],
		data: { 
			title: "Accept Interview",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Interviews",
					url: "/interviews"
				},
				{
					label: "Acccept Interview",
					url: ""
				}
			]
		}
	},
	{
		path: 'reject/:interviewId',
		component: RejectInterviewComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Reject Interview",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Interviews",
					url: "/interviews"
				},
				{
					label: "Reject Interview",
					url: ""
				}
			]
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InterviewRoutingModule {}