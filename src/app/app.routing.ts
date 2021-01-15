import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './interceptors';

const routes: Routes = [
		{
			path: 'home',
			component: HomeComponent,
			canActivate: [AuthGuard],
			data: {
				title: "Home",
				breadcrumb: [
					{
						label: "Home",
						url: ""
					}
				]
			}
		},
		{
			path: '',
			pathMatch: 'full',
			redirectTo: "home",
			canActivate: [AuthGuard]
		},
		{ path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
