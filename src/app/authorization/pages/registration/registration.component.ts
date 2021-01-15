import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/authorization/services/authorization.service';
import { Registration } from '../../models/registration';

@Component({ templateUrl: 'registration.component.html'})
export class RegistrationComponent implements OnInit {
	user: Registration;
	registrationForm: FormGroup;
	loading = false;
	submitted = false;
	isWorker = false
	error = '';

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authenticationService: AuthenticationService
	) 
	{}

	ngOnInit(): void {
		this.registrationForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			login: ['', Validators.required],
			password: ['', Validators.required],
			email: ['', Validators.required],
			role: [''],
			companyName: ['']
		});
	}

	get f() { return this.registrationForm.controls; }

	onSubmit(): void {
		this.submitted = true;

		if (this.registrationForm.invalid) {
			return;
		}

		this.loading = true;
		this.user = new Registration(this.registrationForm.value);
		this.authenticationService.register(this.user)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate(['/login']);
				},
				error => {
					this.error = error;
					this.loading = false;
				});
	}
}