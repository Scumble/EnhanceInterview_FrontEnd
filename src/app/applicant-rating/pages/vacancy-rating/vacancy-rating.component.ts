import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { VacancyRating } from '@app/applicant-rating/models/vacany-rating.model';
import { RatingService } from '@app/applicant-rating/services/rating,service';

@Component({ templateUrl: 'vacancy-rating.component.html'})
export class VacancyRatingComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public ratingList: VacancyRating[];
	public pageOfItems: any[];
	public vacancyId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private authenticationService: AuthenticationService,
		private activatedRoute: ActivatedRoute,
		private ratingService: RatingService)
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["vacancyId"]) {
			this.vacancyId = this.activatedRoute.snapshot.params["vacancyId"];  
		}
	}

	ngOnInit(): void {
		this.getVacancyRatings();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	private getVacancyRatings(): void {
		this.ratingService.getVacancyRatings(this.vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(ratingList => {
				this.ratingList = ratingList;
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}