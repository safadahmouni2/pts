import { Component, EventEmitter, Input, OnChanges, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TestStep } from '../../models/TestStep';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from '../../config/globals';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestStepServices } from "../../services/testStepServices";
import { TestServices } from "../../services/testServices";
import { Test } from "../../models/Test";
import { environment } from "../../../environments/environment";
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { Router } from '@angular/router';
import { DocumentTestService } from '../../services/documentTestService';
import { DocumentTestCaseLibraryService } from '../../services/documentTestCaseLibraryService';
import { TestCaseChangeRequestService } from '../../services/test-case-change-request.service';
import { TestCaseChangeRequest } from '../../models/TestCaseChangeRequest';

@Component({
  selector: 'app-test-form-edit',
  templateUrl: './test-form-edit.component.html',
  styleUrls: ['./test-form-edit.component.css']
})
export class TestFormEditComponent implements OnChanges, OnDestroy {

  showCategoryDropdown = false;
  showStateDropdown = false;
  testCaseId: number;
  testId: number;
  testCaseVersion: number;
  userStoryId: number;
  savedTestSteps: TestStep[];
  testSteps: TestStep[];
  destroy$ = new Subject<void>();
  inputDescriptionFocused = true;
  inputCategoryFocused = true;
  inputExecutionEstimationTimeFocused = true;
  inputPreConditionFocused = true;
  inputTestStepFocused = true;
  inputExpectedResultFocused = true;
  inputStateFocused = true;
  testCaseLoaded = false;
  testCaseExists: boolean;
  router: Router;
  lastSelectedCategory: string;
  clickEventSubscription: Subscription;
  user: any;
  userCode: any;
  attachmentsModel = 'testAttachments';

  testCaseCategories = [
    { key: 'Functional test', value: 'Functional test' },
    { key: 'Non-Functional test', value: 'Non-Functional test' },
    { key: 'Unit test', value: 'Unit test' },
    { key: 'User interface test', value: 'User interface test' },
    { key: 'Database test', value: 'Database test' }
  ];
  isTestStepDescriptionDirty = [];
  isTestStepExpectedResultDirty = [];
  indexInput: number;
  selectInput: string;
  chatUrl: string;
  isProd = environment.production;

  @Input() testSelectedForEdit: Test;
  @Output() exitComponent = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private testStepsService: TestStepServices,
    private testService: TestServices,
    private confirmationDialogService: ConfirmationDialogService,
    public testDocumentService: DocumentTestService,
    public libraryDocumentService: DocumentTestCaseLibraryService,
    private cdRef: ChangeDetectorRef,
    private testCaseChangeRequestService: TestCaseChangeRequestService,
  ) {
    (this.testSelectedForEdit?.testSteps) ? this.testSteps = this.testSelectedForEdit?.testSteps : this.testSteps = [];
  }
  ngOnChanges(): void {
    this.initiateComponent();
    this.getSavedTestStepsByTestId(this.testId);
    this.chatUrl = this.globals.getChatUrl(this.testSelectedForEdit.testId, 'test');
  }

  public initiateComponent() {
    (this.testSelectedForEdit?.testSteps) ? this.testSteps = this.testSelectedForEdit?.testSteps : this.testSteps = [];
    this.userStoryId = this.testSelectedForEdit?.userStoryId;
    this.testCaseId = this.testSelectedForEdit?.testCaseLibraryId;
    this.testCaseVersion = this.testSelectedForEdit?.testCaseVersion;
    this.testId = this.testSelectedForEdit?.testId;
    if (this.testId) {
      this.testStepsService.getTestStepsByTestId(this.testId).pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
          if (data) {
            this.testSteps = data.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
            this.isTestStepDescriptionDirty.length = this.testSteps.length
            this.isTestStepExpectedResultDirty.length = this.testSteps.length;
          }
        });
    }
    // subscribe to detect Unassigned TC click from user story view then refresh edit view of test case
    this.clickEventSubscription = this.sharedService.getClickEvent().pipe(takeUntil(this.destroy$)).subscribe(() => {
      // call of initiateComponent/ngOninit function to load and refresh the edit view of test case
      this.initiateComponent();
    });

    // subscribe to detect Unassigned TC click from user story view then refresh edit view of test case
    this.clickEventSubscription = this.sharedService.getAttachEventState().pipe(takeUntil(this.destroy$)).subscribe(() => {
      // call of initiateComponent/ngOninit function to load and refresh the edit view of test case
      this.initiateComponent();
    });
  }

  public fieldFocus(event: any, nameInput: string): void {
    event.target.parentNode.classList.add('focused');
    if (nameInput === 'shortDescription') {
      this.inputDescriptionFocused = false;
    }
    if (nameInput === 'category') {
      this.inputCategoryFocused = false;
    }
    if (nameInput === 'executionEstimationTime') {
      this.inputExecutionEstimationTimeFocused = false;
    }
    if (nameInput === 'preCondition') {
      this.inputPreConditionFocused = false;
    }
    if (nameInput === 'testStepDescription') {
      this.inputTestStepFocused = false;
    }
    if (nameInput === 'testStepExpectedResult') {
      this.inputExpectedResultFocused = false;
    }
  }

  public selectInputStep(test: TestStep, select: string): void {
    this.selectInput = select;
    this.indexInput = this.testSteps.findIndex(val => val.id === test.id);
  }

  public fieldBlur(event: any): void {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }
  public toggleCategoryDropdown(): void {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }


  public updateTest(test: any, event: any): void {
    this.spinner.show();
    event.stopPropagation();
    this.testService.updateTest(test).subscribe(
      data => {
        this.toastr.success('Test updated successfully');
      });
    //move it to backend to avoid calls
    this.createChangerRequest();
    this.inputDescriptionFocused = true;
    this.inputCategoryFocused = true;
    this.inputExecutionEstimationTimeFocused = true;
    this.inputPreConditionFocused = true;
    this.inputStateFocused = true;
    this.showCategoryDropdown = false;
    this.showStateDropdown = false;
    this.spinner.hide();
  }

  public selectCategory(category: string): void {
    this.testSelectedForEdit.category = category;
  }

  public ResetSelectCategory(event: any): void {
    event.stopPropagation();
    this.testSelectedForEdit.category = this.lastSelectedCategory;
    this.inputCategoryFocused = true;
  }


  public addFieldTestStep(index: number): void {
    this.inputTestStepFocused = true;
    this.inputExpectedResultFocused = true;
    this.updateStepOrder(index, 2);
    const ts = new TestStep();
    ts.stepOrder = index + 1;
    this.testSteps.splice(index, 0, ts);
    this.isTestStepExpectedResultDirty.splice(index, 0, false);
    this.isTestStepDescriptionDirty.splice(index, 0, false);
    this.sendTestStep(ts);
  }

  public addFieldUnderTestStep(index: number): void {
    this.inputTestStepFocused = true;
    this.inputExpectedResultFocused = true;
    const ts = new TestStep();
    if (this.testSteps.length > 0) {
      ts.stepOrder = this.testSteps[this.testSteps.length - 1].stepOrder + 1;
    } else {
      ts.stepOrder = 1;
    }
    this.testSteps.splice(index, 0, ts);
    this.isTestStepExpectedResultDirty.splice(index, 0, false);
    this.isTestStepDescriptionDirty.splice(index, 0, false);
    this.sendTestStep(ts);
  }

  public sendTestStepDescription(testStp: TestStep, index: number): void {
    let testStep: TestStep;
    if (testStp.id !== undefined) {
      testStep = this.getSavedTestStepsById(testStp.id);
      testStep.stepDescription = this.testSteps[index].stepDescription;
      this.sendTestStep(testStep);
    } else {
      this.sendTestStep(testStep);
      this.isTestStepExpectedResultDirty[index] = false;
    }
    this.isTestStepDescriptionDirty[index] = false;
  }

  public sendTestStepExpectedResult(testStp: TestStep, index: number): void {
    let testStep: TestStep;
    if (testStp.id !== undefined) {
      testStep = this.getSavedTestStepsById(testStp.id);
      testStep.expectedResult = this.testSteps[index].expectedResult;
      this.sendTestStep(testStep);
    } else {
      this.sendTestStep(testStp);
      this.isTestStepDescriptionDirty[index] = false;
    }
    this.isTestStepExpectedResultDirty[index] = false;
  }

  private sendTestStep(testStep: TestStep): void {
    if (!testStep.usTestCaseId) { testStep.usTestCaseId = this.testSelectedForEdit.testCaseLibraryId; }
    if (testStep?.id) {
      this.updateTestStep(testStep);
    } else {
      this.addTestStep(testStep);
    }
    this.createChangerRequest();
  }

  public deleteTestStep(id: number, index: number): void {
    this.confirmationDialogService.confirm('Delete Test Step', 'Test step will be deleted from test run. Could you please confirm with OK?')
      .then((confirmed) => {
        if (confirmed) {
          if (id !== undefined) {
            this.testStepsService.deleteTestStep(id).pipe(takeUntil(this.destroy$)).subscribe(
              (data) => {
                this.toastr.success('Test step deleted successfully');
                this.getSavedTestStepsById(this.testId);
              }
            );
          }
          this.updateStepOrder(index, 0);
          this.testSteps.splice(index, 1);
          this.isTestStepDescriptionDirty.splice(index, 1);
          this.isTestStepExpectedResultDirty.splice(index, 1);
        }
      })
  }

  public onResetExpectedResult(testStep: TestStep, index: number): void {
    if (testStep.id !== undefined) {
      const savedTestStep = this.getSavedTestStepsById(testStep.id);
      savedTestStep.expectedResult = this.testSteps[index].expectedResult = savedTestStep.expectedResult;
    } else {
      testStep.expectedResult = null;
    }
    this.isTestStepExpectedResultDirty[index] = false;
  }

  private updateStepOrder(startIndex: number, diff: number): void {
    for (let testStepIndex = startIndex; testStepIndex < this.testSteps.length; testStepIndex++) {
      this.testSteps[testStepIndex].stepOrder = testStepIndex + diff;
      const testStep = this.getSavedTestStepsById(this.testSteps[testStepIndex].id);
      testStep.stepOrder = testStepIndex + diff;
      this.sendTestStep(testStep);
    }
  }

  private getSavedTestStepsByTestId(testId: number): void {
    this.testStepsService.getTestStepsByTestId(testId).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        if (data) {
          this.savedTestSteps = data;
        }
      }
    );
  }

  private addTestStep(testStep: TestStep): void {
    testStep.usTestCaseId = this.testSelectedForEdit.testCaseLibraryId;
    testStep.testId = this.testSelectedForEdit.testId;
    this.testStepsService.addTestStep(testStep).subscribe(
      (data) => {
        const id = + JSON.parse(data).message;
        testStep.id = id;
        this.testStepsService.getTestStepsByTestId(this.testId).pipe(takeUntil(this.destroy$)).subscribe(
          (data) => {
            this.savedTestSteps = data;
            const savedTestStep = this.getSavedTestStepsById(testStep.id);
            testStep = savedTestStep;
            this.toastr.success('Test step created successfully');
          });
      }
    );
  }

  private updateTestStep(testStep: TestStep): void {
    this.testStepsService.updateTestStep(testStep).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.toastr.success('Test step updated successfully');
        this.getSavedTestStepsByTestId(this.testId);
      }
    );
  }
  public onTestStepExpectedResultLineChange(event: any, index: number): void {
    this.onLineChange(event);
    this.isTestStepExpectedResultDirty[index] = true;
  }

  public onTestStepDescriptionLineChange(event: any, index: number): void {
    this.onLineChange(event);
    this.isTestStepDescriptionDirty[index] = true;
  }

  private onLineChange(event: any): void {
    const elm = event.target;
    elm.style.height = (elm.scrollHeight + 4) + 'px';
  }

  public onResetStepDescription(testStep: any, index: number): void {
    if (testStep.id !== undefined) {
      const savedTest = this.getSavedTestStepsById(testStep.id);
      this.testSteps[index].stepDescription = savedTest.stepDescription;
    } else {
      testStep.stepDescription = null;
    }
    this.isTestStepDescriptionDirty[index] = false;
  }

  private getSavedTestStepsById(id: number): TestStep {
    return this.savedTestSteps.find((savedTestStep) => {
      return savedTestStep?.id == id;
    });
  }

  public onExit(): void {
    this.exitComponent.emit();
  }

  getTitle() {
    if (this.testSelectedForEdit?.userStoryId !== 0) {
      return `T${this.testSelectedForEdit?.testId}-U${this.testSelectedForEdit?.userStoryId}-L${this.testSelectedForEdit?.testCaseLibraryId}-V${this.testSelectedForEdit?.testCaseVersion}`;
    } else {
      return `T${this.testSelectedForEdit?.testId}-L${this.testSelectedForEdit?.testCaseLibraryId}-V${this.testSelectedForEdit?.testCaseVersion}`;
    }
  }

  private createChangerRequest() {
    const testCaseChangeRequest = new TestCaseChangeRequest(this.testCaseId, this.testId, +this.globals.getProductId(), +this.globals.getSprintId());
    this.testCaseChangeRequestService.addTestCaseChangeRequest(testCaseChangeRequest).subscribe(
      data => {
        this.toastr.success('Test case change request created successfully');
      },
      err => { console.log(err); }
    );
  }
  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

}

