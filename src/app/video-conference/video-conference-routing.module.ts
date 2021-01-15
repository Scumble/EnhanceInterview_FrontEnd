import { RouterModule, Routes }	from '@angular/router';
import { NgModule } from '@angular/core';
import { VideoConferenceComponent } from './pages/video-conference.component';
import { AuthGuard } from '@app/interceptors';
import { CreateVideoConferenceComponent } from './pages/create-video-conference/create-video-conference.component';
import { CanDeactivateGuardService } from '@app/shared/services/can-deactivate.service';

const routes: Routes = [
	{
		path: 'create-video-conference/:interviewId',
		component: CreateVideoConferenceComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Create video condeference",
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
					label: "Create video condeference",
					url: ""
				}
			]
		}
	},
	{
		path: 'video-conference/:interviewId/:interviewRoom',
		component: VideoConferenceComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuardService],
		data: {
			title: "Video condeference",
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
					label: "Video condeference",
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
export class VideoConferenceRoutingModule {}