import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authorization/services/authorization.service';
import { Login } from './authorization/models/login';
import { CompanyService } from './company/services/company.service';
import { Roles } from './constants/roles';
import { Globals } from './shared/globals';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
	currentUser: Login;
	companyName: string;

	constructor(
		public roles: Globals,
		private router: Router,
		private authenticationService: AuthenticationService,
		private companyService: CompanyService
		)
	{
		this.getCurrentUserInfo();
	}

	private initRoles(): void {
		this.getApplicant();
		this.getRecruiter();
		this.getDeveloper();
		this.getTeamLead();
		this.getPsychologist();
		this.getHR();
		this.getAdmin();
	}

	getApplicant(): void {
		this.roles.isApplicant = this.currentUser && this.currentUser.role === Roles.APPLICANT;
	}

	getRecruiter(): void {
		this.roles.isRecruiter = this.currentUser && this.currentUser.role === Roles.RECRUITER;
	}

	getDeveloper(): void {
		this.roles.isDeveloper = this.currentUser && this.currentUser.role === Roles.DEVELOPER;
	}

	getTeamLead(): void {
		this.roles.isTeamLead = this.currentUser && this.currentUser.role === Roles.TEAM_LEAD;
	}

	getPsychologist(): void {
		this.roles.isPsychologist = this.currentUser && this.currentUser.role === Roles.PSYCHOLOGIST;
	}

	getHR(): void {
		this.roles.isHR = this.currentUser && this.currentUser.role === Roles.HR;
	}

	getAdmin(): void {
		this.roles.isAdmin = this.currentUser && this.currentUser.role === Roles.ADMIN;
	}

	getCurrentUserInfo(): void {
		 this.authenticationService.currentUser.subscribe(x => {
			 this.currentUser = x;
			 this.initRoles();

			 if (this.currentUser && this.currentUser.role !== Roles.APPLICANT) {
			 	this.getCompanyName(this.currentUser && this.currentUser.companyId);
			 }
		});
	}

	getCompanyName(companyId: number): void {
		this.companyService.getCompanyById(companyId).subscribe(company => {
			this.companyName = company.name;
		});
	}

	logout() {
		this.authenticationService.logout();
		this.router.navigate(['/login']);
	}
}