import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDashboardComponent } from './product-dashboard/product-dashboard.component';
import { CreateTestRunComponent } from './create-test-run/create-test-run.component';
import { ExecuteTestRunComponent } from './execute-test-run/execute-test-run.component';
import { TestCaseLibraryEditComponent } from './testcase/test-case-library-edit/test-case-library-edit.component';
import { TesterDashboardComponent } from './tester-dashboard/tester-dashboard.component';
import { TestCaseChangeRequestsComponent } from './test-case-change-requests/test-case-change-requests.component';
import { TestRunEffortGuard } from './routes-guards/test-run-effort.guard';
import { TestRunTestCaseComponent } from './execute-test-run/test-run-test-case/test-run-test-case.component';
import { LibraryTestCaseEffortGuard } from './routes-guards/library-test-case-effort.guard';
import { TestcaseFormComponent } from './testcase/testcase-form/testcase-form.component';

const routes: Routes = [
  { path: 'product-dashboard', component: ProductDashboardComponent },
  { path: 'createtestrun/:install_id/:envId', component: CreateTestRunComponent },
  {
    path: 'executetestrun/:testRunId', component: ExecuteTestRunComponent,
    children: [
      {
        path: '',
        component: TestRunTestCaseComponent
      }
    ], canDeactivate: [TestRunEffortGuard]
  },
  { path: 'testcase/:userStoryId', component: TestCaseLibraryEditComponent },
  { path: 'edittestcase/:userStoryId/:testCaseLibraryId', component: TestCaseLibraryEditComponent, 
  children: [
    {
      path: '',
      component: TestcaseFormComponent
    }
  ], canDeactivate: [LibraryTestCaseEffortGuard]},
  { path: 'test-case-changes', component: TestCaseChangeRequestsComponent },
  { path: 'tester-dashboard', component: TesterDashboardComponent },

  {
    // otherwise redirect to home
    path: '', redirectTo: 'tester-dashboard', pathMatch: 'full'
  },

  {
    // otherwise redirect to NotFound
    path: '**', redirectTo: 'tester-dashboard', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
