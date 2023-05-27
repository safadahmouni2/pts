import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductDashboardComponent } from './product-dashboard/product-dashboard.component';
import { TestManagementComponent } from './product-dashboard/test-management/test-management.component';
import { TestExecutionComponent } from './product-dashboard/test-execution/test-execution.component';
import { UserStoryViewComponent } from './product-dashboard/test-management/user-story-view/user-story-view.component';
import { TestCaseViewComponent } from './product-dashboard/test-management/test-case-view/test-case-view.component';
import { EnvironmentItemComponent } from './shared/environment-item/environment-item.component';
import { EnvironmentSectionComponent } from './shared/environment-section/environment-section.component';
import { EnvironmentContainerComponent } from './shared/environment-container/environment-container.component';
import { UserStoryItemComponent } from './shared/user-story-item/user-story-item.component';
import { UserStoryContainerComponent } from './shared/user-story-container/user-story-container.component';
import { UserStorySectionComponent } from './shared/user-story-section/user-story-section.component';
import { TestCaseItemComponent } from './shared/test-case-item/test-case-item.component';
import { TestCaseContainerComponent } from './shared/test-case-container/test-case-container.component';
import { TestRunItemComponent } from './shared/test-run-item/test-run-item.component';
import { TestItemComponent } from './shared/test-item/test-item.component';
import { TestcaseFormComponent } from './testcase/testcase-form/testcase-form.component';
import { TestcaseLibraryComponent } from './testcase/testcase-library/testcase-library.component';
import { TestcaseUserStoryComponent } from './testcase/testcase-user-story/testcase-user-story.component';
import { CreateTestRunComponent } from './create-test-run/create-test-run.component';
import { TestCaseListComponent } from './create-test-run/test-case-list/test-case-list.component';
import { TestSuiteLibraryComponent } from './create-test-run/test-suite-library/test-suite-library.component';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { TestcaseBreadcrumbComponent } from './testcase/testcase-breadcrumb/testcase-breadcrumb.component';
import { ExecuteTestRunComponent } from './execute-test-run/execute-test-run.component';
import { TestCasesListComponent } from './execute-test-run/test-cases-list/test-cases-list.component';
import { TestRunUserStoryComponent } from './execute-test-run/test-run-user-story/test-run-user-story.component';
import { TestRunTestCaseComponent } from './execute-test-run/test-run-test-case/test-run-test-case.component';
import { AddTicketComponent } from './execute-test-run/add-ticket/add-ticket.component';
import { AddProblemComponent } from './execute-test-run/add-problem/add-problem.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AlertModule } from 'ngx-bootstrap/alert';

import { httpInterceptorProviders } from './auth/auth-interceptor';
import { Globals } from './config/globals';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TestCaseLibraryEditComponent } from './testcase/test-case-library-edit/test-case-library-edit.component';
import { ClickOutSideDirective } from './shared/directives/click-outside.directive';


import { NgxPaginationModule } from 'ngx-pagination';
import { UserStoryDetailsComponent } from './shared/user-story-details/user-story-details.component';
import { TesterDashboardComponent } from './tester-dashboard/tester-dashboard.component';
import { TestFormEditComponent } from "./testcase/test-form-edit/test-form-edit.component";
import { TestCaseHistoryListComponent } from './testcase/test-case-history-list/test-case-history-list.component';
import { TestCaseChangeRequestsModule } from './test-case-change-requests/test-case-change-requests.module';
import { headerModule } from './shared/header/header.module';
import { TestCaseInfoPanelComponent } from './create-test-run/test-case-info-panel/test-case-info-panel.component';
import { TestCaseDetailsComponent } from './shared/test-case-details/test-case-details.component';
import { TestCaseSearchComponent } from './testcase/test-case-search/test-case-search.component';
import { TestCaseImportComponent } from "./testcase/test-case-import/test-case-import.component";

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SaveEffortDialogComponent } from './shared/save-effort-dialog/save-effort-dialog.component';
import { EffortInputValidatorDirective } from './shared/directives/effort-input-validator.directive';
import {ActorInfoModule} from "./shared/show-actor-info/actor-info.module";
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ApolloModule } from 'apollo-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    ProductDashboardComponent,
    TestManagementComponent,
    UserStoryViewComponent,
    TestCaseViewComponent,
    TestExecutionComponent,
    EnvironmentSectionComponent,
    EnvironmentContainerComponent,
    EnvironmentItemComponent,
    UserStoryItemComponent,
    UserStoryContainerComponent,
    UserStorySectionComponent,
    TestCaseItemComponent,
    TestCaseContainerComponent,
    TestRunItemComponent,
    TestRunTestCaseComponent,
    TestItemComponent,
    TestcaseFormComponent,
    TestcaseLibraryComponent,
    TestcaseUserStoryComponent,
    TestcaseBreadcrumbComponent,
    CreateTestRunComponent,
    TestCaseListComponent,
    TestSuiteLibraryComponent,
    ExecuteTestRunComponent,
    TestCasesListComponent,
    TestRunUserStoryComponent,
    AddTicketComponent,
    AddProblemComponent,
    TestCaseLibraryEditComponent,
    ClickOutSideDirective,
    UserStoryDetailsComponent,
    TesterDashboardComponent,
    TestFormEditComponent,
    TestCaseHistoryListComponent,
    TestCaseDetailsComponent,
    TestCaseInfoPanelComponent,
    TestCaseImportComponent,
    TestCaseSearchComponent,
    SaveEffortDialogComponent,
    EffortInputValidatorDirective,
    ConfirmationDialogComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    PerfectScrollbarModule,
    BrowserModule,
    AppRoutingModule,
    TestCaseChangeRequestsModule,
    headerModule,
    HttpClientModule,
    ProgressSpinnerModule,
    ContextMenuModule,
    TreeModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
    }),
    AlertModule.forRoot(),
    NgxSpinnerModule,
    NgxPaginationModule,
    ActorInfoModule,
    ApolloModule
  ],
  exports: [
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    DatePipe,
    Globals,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
