import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/shared/notification/notification.service';
import { Question } from '@app/question/models/question.model';
import { QuestionService } from '@app/question/services/question.service';

@Component({ templateUrl: 'create-question.component.html', styleUrls: ['create-question.component.scss']})
export class CreateQuestionComponent implements OnInit {
	public questionForm: FormGroup;
	public currentUser: Login;
	public question: Question;
	public Editor = ClassicEditor;
	public submitted: boolean = false;
	public error: string = '';
	private vacancyId: number;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private questionService: QuestionService,
		private notificationService : NotificationService,
		private activatedRoute: ActivatedRoute
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["vacancyId"]) {
			this.vacancyId = this.activatedRoute.snapshot.params["vacancyId"];  
		}
	}

	get f() { return this.questionForm.controls; }

	ngOnInit(): void {
		this.initQuestionForm();
	}

	initQuestionForm(): void {
		let category = this.getQuestionCategory();
		this.questionForm = this.formBuilder.group({
			category: [category, Validators.required],
			type: ['', Validators.required],
			complexity: ['', Validators.required],
			content: ['', Validators.required]
		});
	}

	getQuestionCategory(): string {
		if (this.roles.isDeveloper || this.roles.isTeamLead) {
			return "Technical";
		}

		if (this.roles.isPsychologist) {
			return "Psychological";
		}

		if (this.roles.isHR || this.roles.isRecruiter) {
			return "HR";
		}
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.questionForm.invalid) {
			return;
		}

		this.createQuestion();
	}

	onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	createQuestion(): void {
		let question = new Question(
			this.questionForm.value.category,
			this.questionForm.value.type,
			this.questionForm.value.complexity,
			this.questionForm.value.content
		);

		this.questionService.createQuestion(question, this.vacancyId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				() => {
					this.router.navigate(['/vacancies']);
					this.notificationService.showSuccess("Success!!", "Question to the vacancy has been created");
				},
				error => {
					this.error = error;
				});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}