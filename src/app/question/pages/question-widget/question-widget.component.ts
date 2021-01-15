import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { Question } from '@app/question/models/question.model';
import { QuestionService } from '@app/question/services/question.service';
import { InterviewService } from '@app/interview/services/interview.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Answer } from '@app/question/models/answer.model';
import { NotificationService } from '@app/shared/notification/notification.service';
import { ModalService } from '@app/shared/modal-dialog/modal.service';
import { FeedbackService } from '@app/question/services/feedback.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InterviewerService } from '@app/interview/services/interviewer.service';
import { Feedback } from '@app/question/models/feedback.model';
import { Router } from '@angular/router';
declare var $: any;

@Component({selector: 'question-widget', templateUrl: 'question-widget.component.html', styleUrls:['question-widget.component.scss']})
export class QuestionWidgetComponent implements OnInit {
	@Input() interviewId: number;
	public answerForm: FormGroup;
	public feedbackForm: FormGroup;
	public currentUser: Login;
	public vacancyId: number;
	public submitted: boolean = false;
	public feedbackSubmitted: boolean = false;
	public searchTerm: string;
	public questions: Question[];
	public selectedComplexity: number;
	public answers = new Array<Answer>();
	public error: string = '';
	public category: string = '';
	public pageOfItems: any[];
	public Editor = ClassicEditor;
	private interviewerId: string;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private authenticationService: AuthenticationService,
		private interviewService: InterviewService,
		private formBuilder: FormBuilder,
		private questionService: QuestionService,
		private modalService: ModalService,
		private feedbackService: FeedbackService,
		private interviewerService: InterviewerService,
		private router: Router,
		private notificationService : NotificationService) 
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	ngOnInit(): void {
		this.initAnswerForm();
		this.initFeedbackForm();
		this.getQuestions();
	}

	get f() { return this.answerForm.controls; }

	public getQuestions(category?: string, searchTerm?: string, $event?: any, complexity?: number): void {
		if (this.roles.isDeveloper || this.roles.isTeamLead) {
			this.getFilteredQuestions("Technical", searchTerm, complexity);
		}

		if (this.roles.isPsychologist) {
			this.getFilteredQuestions("Psychological", searchTerm, complexity);
		}

		if (this.roles.isHR || this.roles.isRecruiter) {
			this.getFilteredQuestions("HR", searchTerm, complexity);
		}

		if (this.roles.isApplicant) {
			this.category = category;
			this.getFilteredQuestions(category, searchTerm, complexity, $event);
		}
	}

	public onSubmit(): void {
		this.submitted = true;

		if (this.answerForm.invalid) {
			return;
		}

		for (var i = 0; i < this.answers.length; i++) {
			this.addQuestionAnswer(this.answers[i]);
		}

		this.notificationService.showSuccess("Success!!", "You have sent your estimation to the applicant");

		this.answers = [];
	}

	public openModal(id: string): void {
		if (!this.f.estimation.errors) {
			this.modalService.open(id);
		}
	}

	public closeModal(id: string): void {
		this.modalService.close(id);
	}

	public search(str: string): void {
		this.searchTerm = str;
		this.getQuestions(this.category, this.searchTerm, null, this.selectedComplexity);
	}

	public onComplexityChange(complexity: number): void {
		this.selectedComplexity = complexity;
		this.getQuestions(this.category, this.searchTerm, null, this.selectedComplexity);
	}

	public setAnswerModel(vacancyQuestionId: number, estimation: number): void {
		this.upsert(this.answers, new Answer(vacancyQuestionId, this.interviewId, estimation));
	}

	public getFilteredQuestions(category?: string, searchTerm?: string, complexity?: number, $event?: any): void {
		if ($event) {
			this.onTabClick($event);
		}

		this.interviewService.getInterviewById(this.interviewId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(interview => {
				this.vacancyId = interview && interview.vacancyId;
				this.getQuestionsByVacancyId(this.vacancyId, category, searchTerm, complexity);
			});
	}

	public onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	public onFeedbackSubmit(): void {
		this.feedbackSubmitted = true;

		if (this.answerForm.invalid) {
			return;
		}

		this.addFeedback();
	}

	public createFeedbackForm(interviewerId: string): void {
		let feedback = new Feedback(this.interviewId, +interviewerId, this.feedbackForm.value.content);
		this.feedbackService.addFeedback(feedback)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				() => {
					this.router.navigate(["/interviews"]);
					this.notificationService.showSuccess("Success!!", "You have sent your feedback to the applicant");
				},
				error => {
					this.error = error;
				});
	}

	private initFeedbackForm(): void {
		this.feedbackForm = this.formBuilder.group({
			content: ['', Validators.required]
		});
	}

	private addFeedback(): void {
		this.interviewerService.getInterviewerByUserId(this.currentUser.userId)
			.subscribe(interviewer => {
				this.interviewerId = interviewer.id.toString();
				this.createFeedbackForm(this.interviewerId);
			});
	}

	private onTabClick(event: any): void {
		$(".nav-link.active").removeClass("active");
		$(event.currentTarget).addClass("active");
	}

	private upsert(array, item): void {
		const i = array.findIndex(_item => _item.vacancyQuestionId === item.vacancyQuestionId);
		if (i > -1) array[i] = item;
		else array.push(item);
	  }

	private addQuestionAnswer(answer: Answer): void {
		this.questionService.addQuestionAnswer(answer)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				() => {},
				error => {
					this.error = error;
				});
	}

	private initAnswerForm(): void {
		this.answerForm = this.formBuilder.group({
			estimation: ['', Validators.required]
		});
	}

	private getQuestionsByVacancyId(vacancyId: number, category?: string, searchTerm?: string, complexity?: number): void {
		this.questionService.getQuestionsByVacancyId(vacancyId, category, searchTerm)
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

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}