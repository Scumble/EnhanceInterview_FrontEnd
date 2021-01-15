import { RouterModule, Routes }	from '@angular/router';
import { VacancyComponent } from './pages/vacancy.component';
import { AuthGuard } from '@app/interceptors';
import { Roles } from '@app/constants/roles';
import { CreateVacancyComponent } from './pages/vacancy-create-page/vacancy-create.component';
import { VacancyInfoComponent } from './pages/vacancy-info-page/vacancy-info.component';
import { EditVacancyComponent } from './pages/vacancy-edit-page/vacancy-edit.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: 'vacancies',
		component: VacancyComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Vacancies",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: ""
				}
			]
		}
	},
	{
		path: 'vacancies/create',
		component: CreateVacancyComponent,
		canActivate: [AuthGuard],
		data: {
			roles: [Roles.RECRUITER],
			title: "Create Vacancy",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Create Vacancy",
					url: ""
				}
			]
		}
	},
	{
		path: 'vacancies/:vacancyId',
		component: VacancyInfoComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Vacancy Info",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Vacancy № {{vacancyId}}",
					url: ""
				}
			]
		}
	},
	{
		path: 'vacancies/edit/:vacancyId',
		component: EditVacancyComponent,
		canActivate: [AuthGuard],
		data: {
			roles: [Roles.RECRUITER],
			title: "Edit Vacancy",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Edit Vacancy № {{vacancyId}}",
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
export class VacancyRoutingModule {}