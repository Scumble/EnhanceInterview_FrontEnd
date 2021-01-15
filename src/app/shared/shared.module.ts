import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Globals } from './globals';
import { PaginationComponent } from './pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanDeactivateGuardService } from './services/can-deactivate.service';
import { ModalModule } from './modal-dialog/modal.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		NgbModule,
		ReactiveFormsModule,
		NgDynamicBreadcrumbModule,
		BrowserAnimationsModule,
		ModalModule,
		ToastrModule.forRoot(),
		MonacoEditorModule.forRoot()
	],
	declarations: [PaginationComponent, ConfirmationDialogComponent],
	exports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		BrowserAnimationsModule,
		ToastrModule,
		MonacoEditorModule,
		NgDynamicBreadcrumbModule,
		ModalModule,
		PaginationComponent,
		ConfirmationDialogComponent
	],
	providers: [Globals, ConfirmationDialogService, CanDeactivateGuardService]
})
export class SharedModule {}