import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { RatingRoutingModule } from './rating-routing.module';
import { RatingComponent } from './pages/rating.component';
import { VacancyRatingComponent } from './pages/vacancy-rating/vacancy-rating.component';

@NgModule({
	imports: [
		SharedModule,
		RatingRoutingModule
	],
	declarations: [
		RatingComponent,
		VacancyRatingComponent
	]
})

export class RatingModule { }