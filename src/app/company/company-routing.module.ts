import { RouterModule, Routes }	from '@angular/router';
import { AuthGuard } from '@app/interceptors';
import { Roles } from '@app/constants/roles';
import { NgModule } from '@angular/core';
import { CompanyComponent } from './pages/company.component';
import { CreateCompanyComponent } from './pages/create-company/create-company.component';
import { EditCompanyComponent } from './pages/edit-company/edit-company.component';
import { CompanyInfoComponent } from './pages/company-info/company-info.component';

const routes: Routes = [
	{
		path: 'companies',
		component: CompanyComponent,
		canActivate: [AuthGuard],
		data: {
			roles: [Roles.ADMIN],
			title: "Companies",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Companies",
					url: ""
				}
			]
		}
	},
	{
		path: 'companies/create',
		component: CreateCompanyComponent,
		canActivate: [AuthGuard],
		data: {
			roles: [Roles.ADMIN],
			title: "Create Company",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Company",
					url: "/companies"
				},
				{
					label: "Create Company",
					url: ""
				}
			]
		}
	},
	{
		path: 'companies/edit/:companyId',
		component: EditCompanyComponent,
		canActivate: [AuthGuard],
		data: {
			roles: [Roles.ADMIN, Roles.HR, Roles.RECRUITER],
			title: "Edit Company",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Company",
					url: "/companies"
				},
				{
					label: "Edit Company",
					url: ""
				}
			]
		}
	},
	{
		path: 'companies/:companyId',
		component: CompanyInfoComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Company Info",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Company",
					url: "/companies"
				},
				{
					label: "Company Info",
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
export class CompanyRoutingModule {}