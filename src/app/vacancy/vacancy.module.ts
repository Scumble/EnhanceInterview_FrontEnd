import { NgModule } from '@angular/core';
import { VacancyRoutingModule }  from './vacancy-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { VacancyComponent } from './pages/vacancy.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CreateVacancyComponent } from './pages/vacancy-create-page/vacancy-create.component';
import { VacancyInfoComponent } from './pages/vacancy-info-page/vacancy-info.component';
import { EditVacancyComponent } from './pages/vacancy-edit-page/vacancy-edit.component';

@NgModule({
	imports: [
		SharedModule,
		CKEditorModule,
		VacancyRoutingModule
	],
	declarations: [
		VacancyComponent,
		CreateVacancyComponent,
		EditVacancyComponent,
		VacancyInfoComponent
	]
})

export class VacancyModule { }