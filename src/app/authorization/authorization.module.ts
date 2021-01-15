import { NgModule } from '@angular/core';
import { AuthorizationRoutingModule }  from './authorization-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
	SharedModule,
	AuthorizationRoutingModule
  ],
  declarations: [LoginComponent, RegistrationComponent]
})

export class AuthorizationModule { }