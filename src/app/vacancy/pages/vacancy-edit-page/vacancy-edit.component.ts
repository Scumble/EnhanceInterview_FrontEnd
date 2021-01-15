import { Component, OnInit, ViewChild } from '@angular/core';
import { VacancyService } from '../../services/vacancy.service';
import { Vacancy } from '../../models/vacancy.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RecruiterService } from '@app/vacancy/services/recruiter.service';
import { Recruiter } from '@app/vacancy/models/recruiter.model';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@app/shared/notification/notification.service';

@Component({ templateUrl: 'vacancy-edit.component.html'})
export class EditVacancyComponent implements OnInit {
	public vacancyForm: FormGroup;
	public currentUser: Login;
	public vacancy: Vacancy;
	public vacancyId: number;
	public recruiter: Recruiter;
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
		private vacancyService: VacancyService,
		private recruiterService: RecruiterService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["vacancyId"]) {
			this.vacancyId = this.activatedRoute.snapshot.params["vacancyId"];  
		}
	}

	get f() { return this.vacancyForm.controls; }

	ngOnInit(): void {
		this.getRecruiter();
		this.initVacancyForm();
		this.fillVacancyForm();
	}

	initVacancyForm(): void {
		this.vacancyForm = this.formBuilder.group({
			id: 0,
			title: ['', Validators.required],
			info: ['', Validators.required],
			location: ['', Validators.required],
			endDate: ['', Validators.required]
		});
	}

	fillVacancyForm(): void {
		let datePicker = new DatePipe('en-Us');
		this.vacancyService.getVacancyById(this.vacancyId)
			.subscribe(vacancy => this.vacancyForm.patchValue({
				id: vacancy['id'],
				title: vacancy['title'],
				info: vacancy['info'],
				location: vacancy['location'],
				endDate: datePicker.transform(vacancy['endDate'], 'y-MM-dd')
			}));
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.vacancyForm.invalid) {
			return;
		}

		this.updateVacancy();
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

	updateVacancy(): void {
		let vacancy = new Vacancy(this.vacancyForm.value);
		vacancy.recruiterId = this.recruiter.id;

		this.vacancyService.updateVacancy(vacancy)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				data => {
					this.router.navigate(['/vacancies']);
					this.notificationService.showSuccess("Success!!", "Vacancy has been edited");
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