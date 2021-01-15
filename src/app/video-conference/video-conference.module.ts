import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { VideoConferenceRoutingModule } from './video-conference-routing.module';
import { VideoConferenceComponent } from './pages/video-conference.component';
import { VideoComponent } from './pages/video/video.component';
import { CreateVideoConferenceComponent } from './pages/create-video-conference/create-video-conference.component';
import { VideoChatComponent } from './pages/video-chat/video-chat.component';
import { QuestionWidgetComponent } from '@app/question/pages/question-widget/question-widget.component';
import { BarRatingModule } from "ngx-bar-rating";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
	imports: [
		SharedModule,
		CKEditorModule,
		VideoConferenceRoutingModule,
		BarRatingModule
	],
	declarations: [
		QuestionWidgetComponent,
		VideoConferenceComponent,
		VideoComponent,
		CreateVideoConferenceComponent,
		VideoChatComponent
	]
})

export class VideoConferenceModule { }