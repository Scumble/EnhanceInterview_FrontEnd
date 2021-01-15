import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CreateQuestionComponent } from './pages/create-question/create-question.component';
import { QuestionRoutingModule } from './question-routing.module';
import { QuestionComponent } from './pages/question.component';
import { EditQuestionComponent } from './pages/edit-question/edit-question.component';
import { QuestionResultsComponent } from './pages/question-results/question-results.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { QuestionWidgetComponent } from './pages/question-widget/question-widget.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';

@NgModule({
	imports: [
		SharedModule,
		CKEditorModule,
		BarRatingModule,
		QuestionRoutingModule
	],
	declarations: [
		CreateQuestionComponent,
		EditQuestionComponent,
		QuestionComponent,
		QuestionResultsComponent,
		FeedbackComponent
	]
})

export class QuestionModule { }