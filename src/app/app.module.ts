﻿import { NgModule, ApplicationModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './interceptors';
import { HomeComponent } from './home/home.component';
import { AuthorizationModule } from './authorization/authorization.module';
import { SharedModule } from './shared/shared.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { InterviewModule } from './interview/interview.module';
import { ApplicantModule } from './applicant/applicant.module';
import { VideoConferenceModule } from './video-conference/video-conference.module';
import { QuestionModule } from './question/question.module';
import { CompanyModule } from './company/company.module';
import { RatingModule } from './applicant-rating/rating.module';
import { ModalModule } from './shared/modal-dialog/modal.module';

@NgModule({
	imports: [
		SharedModule,
		HttpClientModule,
		AuthorizationModule,
		QuestionModule,
		VacancyModule,
		InterviewModule,
		CompanyModule,
		VideoConferenceModule,
		ApplicantModule,
		RatingModule,
		appRoutingModule
	],
	declarations: [
		AppComponent,
		HomeComponent
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
