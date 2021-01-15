import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { ConfirmationDialogService } from '@app/shared/confirmation-dialog/confirmation-dialog.service';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../models/question.model';
import { QuestionService } from '../services/question.service';

@Component({ templateUrl: 'question.component.html'})
export class QuestionComponent implements OnInit {
	public currentUser: Login;
	public searchTerm: string;
	public questions: Question[];
	public vacancyId: number;
	public selectedComplexity: number;
	public category: string = "";
	public pageOfItems: any[];
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private confirmationDialogService: ConfirmationDialogService,
		private authenticationService: AuthenticationService,
		private notificationService : NotificationService,
		private questionService: QuestionService,
		private route: ActivatedRoute,
		private router: Router
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.route.snapshot.params["vacancyId"]) {
			this.vacancyId = this.route.snapshot.params["vacancyId"];  
		}
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.searchTerm = params['searchString'];
		});

		this.getQuestions();
	}

	public onChangePage(pageOfItems: Array<any>): void {
		this.pageOfItems = pageOfItems;
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getQuestions(this.category, this.searchTerm, this.selectedComplexity);
	}

	public onComplexityChange(complexity: number): void {
		this.selectedComplexity = complexity;
		this.getQuestions(this.category, this.searchTerm, this.selectedComplexity);
	}

	public getQuestions(category?: string, searchString?: string, complexity?: number): void {
		if (this.roles.isDeveloper || this.roles.isTeamLead) {
			this.category = "Technical";
			this.getQuestionsByVacancyId(this.category, searchString, complexity);
		}

		if (this.roles.isPsychologist) {
			this.category = "Psychological";
			this.getQuestionsByVacancyId(this.category, searchString, complexity);
		}

		if (this.roles.isHR || this.roles.isRecruiter) {
			this.category = "HR";
			this.getQuestionsByVacancyId(this.category, searchString, complexity);
		}

		const queryParams = {
			searchString: searchString,
			category: category
		}

		this.router.navigate(['/question/vacancy/', this.vacancyId], {queryParams});
	}

	public openDeletionDialog(questionId: number): void {
		this.confirmationDialogService.confirm(
			'Please confirm the deletion',
			`Do you really want to delete the question with №: ${questionId}?`)
				.then((confirmed) => {
					 if (confirmed) {
						this.deleteQuestion(questionId);
					}})
	}

	private getQuestionsByVacancyId(category?: string, searchTerm?: string, complexity?: number): void {
		this.questionService.getQuestionsByVacancyId(this.vacancyId, category, searchTerm)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(questions => {
				if (complexity) {
					this.questions = questions.filter(x => x.complexity === +complexity);
				}
				else {
					this.questions = questions;
				}
			});
	}

	private deleteQuestion(questionId: number): void {
		this.questionService.deleteQuestion(questionId, this.vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(data => {
				this.getQuestions();
				this.notificationService.showError("Success!!", "Question has been deleted");
			})
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}