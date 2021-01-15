import { RouterModule, Routes }	from '@angular/router';
import { AuthGuard } from '@app/interceptors';
import { NgModule } from '@angular/core';
import { CreateQuestionComponent } from './pages/create-question/create-question.component';
import { QuestionComponent } from './pages/question.component';
import { EditQuestionComponent } from './pages/edit-question/edit-question.component';
import { QuestionResultsComponent } from './pages/question-results/question-results.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';

const routes: Routes = [
	{
		path: 'question/create/:vacancyId',
		component: CreateQuestionComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Create Question",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Create Question",
					url: ""
				}
			]
		}
	},
	{
		path: 'question/edit/:questionId/:vacancyId',
		component: EditQuestionComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Edit Question",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Questions",
					url: "/question/vacancy/:vacancyId"
				},
				{
					label: "Edit Question № {{questionId}}",
					url: ""
				}
			]
		}
	},
	{
		path: 'question/vacancy/:vacancyId',
		component: QuestionComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Questions",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Vacancies",
					url: "/vacancies"
				},
				{
					label: "Questions",
					url: ""
				}
			]
		}
	},
	{
		path: 'results/interview/:interviewId',
		component: QuestionResultsComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Interview Results",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Interviews",
					url: "/interviews"
				},
				{
					label: "Interview Results",
					url: ""
				}
			]
		}
	},
	{
		path: 'feedbacks/interview/:interviewId',
		component: FeedbackComponent,
		canActivate: [AuthGuard],
		data: {
			title: "Feedback Results",
			breadcrumb: [
				{
					label: "Home",
					url: "/home"
				},
				{
					label: "Interviews",
					url: "/interviews"
				},
				{
					label: "Feedback Results",
					url: ""
				}
			]
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionRoutingModule {}