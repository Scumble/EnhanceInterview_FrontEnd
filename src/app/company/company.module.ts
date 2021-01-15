import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CompanyComponent } from './pages/company.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CreateCompanyComponent } from './pages/create-company/create-company.component';
import { EditCompanyComponent } from './pages/edit-company/edit-company.component';
import { CompanyInfoComponent } from './pages/company-info/company-info.component';

@NgModule({
	imports: [
		SharedModule,
		CKEditorModule,
		CompanyRoutingModule
	],
	declarations: [
		CompanyComponent,
		CreateCompanyComponent,
		EditCompanyComponent,
		CompanyInfoComponent
	]
})

export class CompanyModule { }