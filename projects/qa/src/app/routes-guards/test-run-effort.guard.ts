
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ExecuteTestRunComponent } from '../execute-test-run/execute-test-run.component';
import { SaveEffortDialogService } from '../services/save-effort-dialog.service';
import { TestEffortServices } from '../services/testEffortServices';



@Injectable({
  providedIn: 'root'
})
export class TestRunEffortGuard implements CanDeactivate<ExecuteTestRunComponent> {
  constructor(private saveEffortDialogService: SaveEffortDialogService, private testEffortServices: TestEffortServices) { }
  canDeactivate(
    component: ExecuteTestRunComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    const isRunning = component.running;

    if (isRunning) {
      component.getDuration();
      return this.saveEffortDialogService.confirm(
        'Test Run Execution',
        'Please record your test efforts on test: ' + component.testSelected.testId
        + ' before moving to something else. You can return to test: ' + component.testSelected.testId
        + ' at any time. ',
        component.testSelected.testId,
        component.testSelected.shortDescription,
        component.testEffort
      ).then(confirmed => {
        if (!confirmed) {
          return false;
        } else {
          this.testEffortServices.editTestEffort(confirmed.id, confirmed).subscribe(
            editTestEffortResponse => {
              component.reset();
              component.running = false;
            });
          return true;
        }
      });
    }

    return true;
  }

}
