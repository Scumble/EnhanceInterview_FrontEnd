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

@Component({ templateUrl: 'edit-question.component.html', styleUrls: ['../create-question/create-question.component.scss']})
export class EditQuestionComponent implements OnInit {
	public questionForm: FormGroup;
	public currentUser: Login;
	public question: Question;
	public questionId: number;
	public vacancyId: number;
	public Editor = ClassicEditor;
	public submitted: boolean = false;
	public error: string = '';
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private questionService: QuestionService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["questionId"]) {
			this.questionId = this.activatedRoute.snapshot.params["questionId"];  
		}

		 if (this.activatedRoute.snapshot.params["vacancyId"]) {
		 	this.vacancyId = this.activatedRoute.snapshot.params["vacancyId"];  
		}
	}

	get f() { return this.questionForm.controls; }

	ngOnInit(): void {
		this.initQuestionForm();
		this.fillQuestionForm();
	}

	initQuestionForm(): void {
		this.questionForm = this.formBuilder.group({
			id: 0,
			category: ['', Validators.required],
			type: ['', Validators.required],
			complexity: ['', Validators.required],
			content: ['', Validators.required]
		});
	}

	fillQuestionForm(): void {
		this.questionService.getQuestionsById(this.questionId)
			.subscribe(question => this.questionForm.patchValue({
				id: question['id'],
				category: question['category'],
				type: question['type'],
				complexity: question['complexity'],
				content: question['content']
			}));
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.questionForm.invalid) {
			return;
		}

		this.updateQuestion();
	}

	onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	updateQuestion(): void {
		let question = new Question(
			this.questionForm.value.category,
			this.questionForm.value.type,
			this.questionForm.value.complexity,
			this.questionForm.value.content,
			this.questionForm.value.id
		);

		this.questionService.updateQuestion(question)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				data => {
					this.router.navigate(['/question/vacancy/' + this.vacancyId]);
					this.notificationService.showSuccess("Success!!", "Question has been edited");
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