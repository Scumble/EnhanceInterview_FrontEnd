import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Recruiter } from '@app/vacancy/models/recruiter.model';
import { NotificationService } from '@app/shared/notification/notification.service';
import { Company } from '@app/company/models/company';
import { CompanyService } from '@app/company/services/company.service';

@Component({ templateUrl: 'create-company.component.html', styleUrls: ['create-company.component.scss']})
export class CreateCompanyComponent implements OnInit {
	public companyForm: FormGroup;
	public currentUser: Login;
	public company: Company;
	public recruiter: Recruiter;
	public Editor = ClassicEditor;
	public submitted: boolean = false;
	public error: string = '';
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private companyService: CompanyService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;
	}

	get f() { return this.companyForm.controls; }

	ngOnInit(): void {
		this.initCompanyForm();
	}

	public onSubmit(): void {
		this.submitted = true;

		if (this.companyForm.invalid) {
			return;
		}

		this.createCompany();
	}

	public onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	private initCompanyForm(): void {
		this.companyForm = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			location: ['', Validators.required]
		});
	}

	private createCompany(): void {
		let company = new Company(this.companyForm.value);

		this.companyService.createCompany(company)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				() => {
					this.router.navigate(['/companies']);
					this.notificationService.showSuccess("Success!!", "Company has been created");
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