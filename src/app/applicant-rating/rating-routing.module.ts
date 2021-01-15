import { RouterModule, Routes }	from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@app/interceptors';
import { RatingComponent } from './pages/rating.component';
import { VacancyRatingComponent } from './pages/vacancy-rating/vacancy-rating.component';

const routes: Routes = [
	{
		path: 'rating',
		component: RatingComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Rating",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Rating",
					url: ""
				}
			]
		}
	},
	{
		path: 'vacancy-rating/:vacancyId',
		component: VacancyRatingComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Vacancy rating",
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
					label: "Vacancy rating",
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
export class RatingRoutingModule {}