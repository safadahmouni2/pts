
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ExecuteTestRunComponent } from '../execute-test-run/execute-test-run.component';
import { SaveEffortDialogService } from '../services/save-effort-dialog.service';
import { TestEffortServices } from '../services/testEffortServices';
import { TestCaseLibraryEditComponent } from '../testcase/test-case-library-edit/test-case-library-edit.component';
import { LibraryTestCaseEffortService } from '../services/libraryTestCaseEffortService';
import { TestcaseFormComponent } from '../testcase/testcase-form/testcase-form.component';



@Injectable({
  providedIn: 'root'
})
export class LibraryTestCaseEffortGuard implements CanDeactivate<TestCaseLibraryEditComponent> {
  constructor(private saveEffortDialogService: SaveEffortDialogService, private libraryTestCaseEffortService: LibraryTestCaseEffortService) { }
  canDeactivate(
    component: TestCaseLibraryEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    const isRunning = component.running;
    const testCaseLibrarySelected = component.oldSelect ? component.oldSelect.testCase:component.testCaseLibrarySelected ;
    if (isRunning) {
      component.getDuration();
      return this.saveEffortDialogService.confirm(
        'Library Test Case',
        'the elapsed effort on the TC '+ testCaseLibrarySelected?.testCaseLibraryId +' will be saved automatically on closing this alert '
        +' You can adjust your effort manually before the timeout',
        testCaseLibrarySelected?.testCaseLibraryId,
        testCaseLibrarySelected?.shortDescription,
        component.libraryTestCaseEffort
      ).then(confirmed => {
        if (!confirmed) {
          return false;
        } else {
          this.libraryTestCaseEffortService.editLibraryTestCaseEffort(confirmed.id, confirmed).subscribe(
            editLibraryTestCaseEffortResponse => {
              // component.reset();
              component.running = false;
            });
          return true;
        }
      });
    }

    return true;
  }

}
