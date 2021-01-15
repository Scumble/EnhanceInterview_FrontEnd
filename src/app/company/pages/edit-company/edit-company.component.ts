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
import { Company } from '@app/company/models/company';
import { CompanyService } from '@app/company/services/company.service';

@Component({ templateUrl: 'edit-company.component.html'})
export class EditCompanyComponent implements OnInit {
	public companyForm: FormGroup;
	public currentUser: Login;
	public company: Company;
	public Editor = ClassicEditor;
	public companyId: number;
	public submitted: boolean = false;
	public error: string = '';
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private companyService: CompanyService,
		private notificationService : NotificationService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["companyId"]) {
			this.companyId = this.activatedRoute.snapshot.params["companyId"];  
		}
	}

	get f() { return this.companyForm.controls; }

	ngOnInit(): void {
		this.initCompanyForm();
		this.fillCompanyForm();
	}

	public onSubmit(): void {
		this.submitted = true;

		if (this.companyForm.invalid) {
			return;
		}

		this.updateCompany();
	}

	public onReady(editor: ClassicEditor): void {
		editor.ui.getEditableElement().parentElement.insertBefore(
			editor.ui.view.toolbar.element,
			editor.ui.getEditableElement()
		);
	}

	private initCompanyForm(): void {
		this.companyForm = this.formBuilder.group({
			id: 0,
			name: ['', Validators.required],
			description: ['', Validators.required],
			location: ['', Validators.required]
		});
	}

	private fillCompanyForm(): void {
		this.companyService.getCompanyById(this.companyId)
			.subscribe(company => this.companyForm.patchValue({
				id: company['id'],
				name: company['name'],
				description: company['description'],
				location: company['location']
			}));
	}

	updateCompany(): void {
		let company = new Company(this.companyForm.value);

		this.companyService.updateCompany(company)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				data => {
					this.router.navigate(['/companies']);
					this.notificationService.showSuccess("Success!!", "Company has been edited");
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