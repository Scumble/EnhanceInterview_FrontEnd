import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/authorization/services/authorization.service';

@Component({ templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService
	) 
	{
		if (this.authenticationService.currentUserValue) { 
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			login: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	get f() { return this.loginForm.controls; }

	onSubmit(): void {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService.login(this.f.login.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate(['/home']);
				},
				error => {
					this.error = error;
					this.loading = false;
				});
	}
}