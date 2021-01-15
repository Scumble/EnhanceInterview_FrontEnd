import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '@app/question/models/result.model';
import { QuestionService } from '@app/question/services/question.service';

@Component({ templateUrl: 'question-results.component.html'})
export class QuestionResultsComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public questionResults: Result[];
	public pageOfItems: any[];
	public selectedCategory: string;
	public selectedComplexity: number;
	public interviewId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private authenticationService: AuthenticationService,
		private questionService: QuestionService,
		private route: ActivatedRoute,
		private router: Router) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.route.snapshot.params["interviewId"]) {
			this.interviewId = this.route.snapshot.params["interviewId"];  
		}
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.searchTerm = params['searchString'];
		});

		this.getInterviewResultsByInterviewId();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getInterviewResultsByInterviewId(this.selectedCategory, this.searchTerm, this.selectedComplexity);
	}

	public onCategoryChange(category: string): void {
		this.selectedCategory = category;
		this.getInterviewResultsByInterviewId(this.selectedCategory, this.searchTerm, this.selectedComplexity);
	}

	public onComplexityChange(complexity: number): void {
		this.selectedComplexity = complexity;
		this.getInterviewResultsByInterviewId(this.selectedCategory, this.searchTerm, this.selectedComplexity);
	}

	private getInterviewResultsByInterviewId(category?: string, searchString?: string, complexity?: number): void {
		this.questionService.getInterviewResultsByInterviewId(this.interviewId, category, searchString)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(questionResults => {
				if (complexity) {
					this.questionResults = questionResults.filter(x => x.complexity === +complexity);
				}
				else {
					this.questionResults = questionResults;
				}
			})

			const queryParams = {
				searchString: searchString,
				category: category
			}
	
			this.router.navigate(['/results/interview/', this.interviewId], {queryParams});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}