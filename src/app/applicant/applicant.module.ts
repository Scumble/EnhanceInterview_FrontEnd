import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ApplicantComponent } from './pages/applicant.component';
import { ApplicantRoutingModule } from './applicant-routing.module';
import { ApplicantInfoComponent } from './pages/applicant-info.component.ts/applicant-info.component';

@NgModule({
	imports: [
		SharedModule,
		ApplicantRoutingModule
	],
	declarations: [
		ApplicantComponent,
		ApplicantInfoComponent
	]
})

export class ApplicantModule { }