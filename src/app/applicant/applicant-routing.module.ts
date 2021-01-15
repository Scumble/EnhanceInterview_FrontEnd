import { RouterModule, Routes }	from '@angular/router';
import { AuthGuard } from '@app/interceptors';
import { NgModule } from '@angular/core';
import { ApplicantComponent } from './pages/applicant.component';
import { ApplicantInfoComponent } from './pages/applicant-info.component.ts/applicant-info.component';

const routes: Routes = [
	{
		path: 'applicant/profile/:userId',
		component: ApplicantComponent,
		canActivate: [AuthGuard],
		data: { 
			title: "Profile page",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Profile page",
					url: ""
				}
			]
		}
	},
	{
		path: 'applicant/:applicantId',
		component: ApplicantInfoComponent,
		canActivate: [AuthGuard],
		data: { 
			title: "Applicant № {{applicantId}}",
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
					label: "Applicant № {{applicantId}}",
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
export class ApplicantRoutingModule {}