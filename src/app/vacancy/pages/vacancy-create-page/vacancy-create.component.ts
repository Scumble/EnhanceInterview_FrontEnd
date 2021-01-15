import { Component, OnInit, ViewChild } from '@angular/core';
import { VacancyService } from '../../services/vacancy.service';
import { Vacancy } from '../../models/vacancy.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Roles } from '@app/constants/roles';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecruiterService } from '@app/vacancy/services/recruiter.service';
import { Recruiter } from '@app/vacancy/models/recruiter.model';
import { NotificationService } from '@app/shared/notification/notification.service';

@Component({ templateUrl: 'vacancy-create.component.html', styleUrls: ['vacancy-create.component.scss']})
export class CreateVacancyComponent implements OnInit {
	public vacancyForm: FormGroup;
	public currentUser: Login;
	public vacancy: Vacancy;
	public recruiter: Recruiter;
	public Editor = ClassicEditor;
	public submitted: boolean = false;
	public error: string = '';
	public currentDate: string = new Date().toISOString().substring(0, 16);
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private vacancyService: VacancyService,
		private recruiterService: RecruiterService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	get f() { return this.vacancyForm.controls; }

	ngOnInit(): void {
		this.getRecruiter();
		this.initVacancyForm();
	}

	initVacancyForm(): void {
		this.vacancyForm = this.formBuilder.group({
			title: ['', Validators.required],
			info: ['', Validators.required],
			location: ['', Validators.required],
			endDate: ['', Validators.required]
		});
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.vacancyForm.invalid) {
			return;
		}

		this.createVacancy();
	}

	onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	getRecruiter(): void {
		this.recruiterService.getRecruiterByUserId(this.currentUser.userId)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				data => {
					this.recruiter = data;
				},
				error => {
					this.error = error;
				});
	}

	createVacancy(): void {
		let vacancy = new Vacancy(this.vacancyForm.value);
		vacancy.recruiterId = this.recruiter.id;

		this.vacancyService.createVacancy(vacancy)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				() => {
					this.router.navigate(['/vacancies']);
					this.notificationService.showSuccess("Success!!", "Vacancy has been created");
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