import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../services/shared.service';
import { UsTestCaseServices } from '../../services/usTestCaseServices';
import { UsTestCase } from '../../models/UsTestCase';
import { environment } from '../../../environments/environment';
import { Globals } from '../../config/globals';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {TestServices} from "../../services/testServices";

@Component({
  selector: 'app-test-case-item',
  templateUrl: './test-case-item.component.html',
  styleUrls: ['./test-case-item.component.css']
})
export class TestCaseItemComponent implements OnInit, OnDestroy {
  @Input() isTestCaseView: boolean;
  @Input() testCase: UsTestCase;
  @Input() productEnvironments: any;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('with_test_result') withTestResult = false;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('has_container') hasContainer = false;
  @Output() sendRequestToParent = new EventEmitter();
  containerSelector = '';
  chatUrl: string;
  isProd = environment.production;
  destroy$ = new Subject<void>();
  collapsed = false;

  constructor(
    private testCaseServices: UsTestCaseServices, private toastr: ToastrService, private confirmationDialogService: ConfirmationDialogService,
    private spinner: NgxSpinnerService, private sharedService: SharedService, private globals: Globals,
    private testService:TestServices ) { }

  ngOnInit() {
    if (this.hasContainer) {
      this.containerSelector = 'body';

    }

    this.chatUrl = this.globals.getChatUrl(this.testCase.usTestCaseId, 'us_test_case');
  }

  public async deleteTestCase(id: number): Promise<void> {
    const confirmed = await this.confirmationDialogService.confirm(
      'Unassign Test Case',
      'Test Case will be unassigned from user story:' + this.testCase.userStoryId + '. Could you please confirm with OK?'
    );
    if (!confirmed) {
      return;
    }
    if (id !== undefined) {
      this.testCaseServices.deleteTestCase(id).pipe(takeUntil(this.destroy$)).subscribe(
        data => {
          this.toastr.success('Test case successfully unassigned from the user story');
          this.sendRequestToParent.emit(id);
          // send event to refresh edit view of test case
          this.sharedService.sendClickEvent();
        }
      );
    }
  }

  collapse() {
    this.collapsed = !this.collapsed;
    this.testCase.testResult=[];
    if(this.collapsed) {
      if(this.testCase.userStoryId!=null && this.testCase.testCaseLibraryId!=null){
      this.testService.getTestResult(this.testCase.userStoryId,this.testCase.testCaseLibraryId).subscribe(
        testResultResponse => {
          this.testCase.testResult=   testResultResponse;
            if (this.testCase.testResult.length !== 0) {
              this.testCase.testResult.forEach(test => {
                Object.assign(test, { env: this.productEnvironments.find(environment => +environment.Env_id === test.environmentId) });
              });
            }
        }
      )
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
