import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Login } from '@app/authorization/models/login';
import { Globals } from '@app/shared/globals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@app/shared/notification/notification.service';
import { Applicant } from '../models/applicant.model';
import { ApplicantService } from '../services/applicant.service';
import { UploadService } from '@app/shared/upload-file/upload.service';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'applicant.component.html'})
export class ApplicantComponent implements OnInit {
	public applicantForm: FormGroup;
	public currentUser: Login;
	public userId: string;
	public submitted: boolean = false;
	public error: string = '';
	public progress: number;
	public response: any;
	public message: string;
	@Output() public onUploadFinished = new EventEmitter();
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		public roles: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private applicantService: ApplicantService,
		private notificationService : NotificationService,
		private uploadService: UploadService
		) 
	{
		this.currentUser = this.authenticationService.currentUserValue;

		if (this.activatedRoute.snapshot.params["userId"]) {
			this.userId = this.activatedRoute.snapshot.params["userId"];  
		}
	}

	get f() { return this.applicantForm.controls; }

	ngOnInit(): void {
		this.initApplicantForm();
		this.fillApplicantForm();
	}

	public onSubmit(): void {
		this.submitted = true;

		if (this.applicantForm.invalid) {
			return;
		}

		this.updateApplicant();
	}

	public uploadFile = (files: any) => {
		this.uploadService.uploadFile(files)
			.subscribe(event => {
				if (event.type === HttpEventType.UploadProgress)
				this.progress = Math.round(100 * event.loaded / event.total);
			  else if (event.type === HttpEventType.Response) {
				this.message = 'Upload success.';
				this.onUploadFinished.emit(event.body);
				this.response = event.body;
			  }
		  });
	  }

	public createImagePath(imagePath: string): string {
		if (imagePath != '') {
			return `${environment.signalRUrl}/${imagePath}`;
		}
	}

	private initApplicantForm(): void {
		this.applicantForm = this.formBuilder.group({
			id: 0,
			userId: [''],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.required],
			phoneNumber: ['', Validators.required],
			information: ['', Validators.required],
			skills: ['', Validators.required],
			education: [''],
			experience: [''],
			profileImgPath: [''],
			birthDate: ['', Validators.required]
		});
	}

	private fillApplicantForm(): void {
		let datePicker = new DatePipe('en-Us');
		this.applicantService.getApplicantByUserId(this.userId)
			.subscribe(applicant => this.applicantForm.patchValue({
				id: applicant['id'],
				userId: this.userId,
				firstName: applicant['firstName'],
				lastName: applicant['lastName'],
				email: applicant['email'],
				phoneNumber: applicant['phoneNumber'],
				information: applicant['information'],
				skills: applicant['skills'],
				education: applicant['education'],
				experience: applicant['experience'],
				profileImgPath: applicant['profileImgPath'],
				birthDate: datePicker.transform(applicant['birthDate'], 'y-MM-dd')
			}));
	}

	private updateApplicant(): void {
		let applicant = new Applicant(this.applicantForm.value);
		if (this.response) {
			applicant.profileImgPath = this.response && this.response.imagePath;
		}

		this.applicantService.updateApplicant(applicant)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(
				data => {
					this.router.navigate(['/home']);
					this.notificationService.showSuccess("Success!!", "Profile has been updated");
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