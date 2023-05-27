import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Globals } from '../../config/globals';
import { TestCaseChangeRequest } from '../../models/TestCaseChangeRequest';
import { TestCaseChanges } from '../../models/TestCaseChanges';
import { TestStep } from '../../models/TestStep';
import TestStepLibrary from '../../models/TestStepLibrary';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { TestCaseChangeRequestService } from '../../services/test-case-change-request.service';
import { TestCaseChangesService } from '../../services/test-case-changes.service';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import { TestStepChangesService } from '../../services/test-step-changes.service';
import { TestStepLibraryServices } from '../../services/TestStepLibraryServices';
import * as _ from 'lodash';
import { TestCaseLibrary } from "../../models/test-case-library";
import { DropDownListValues } from "../../models/DropDownListValues";

@Component({
  selector: 'app-test-case-change-request-manager',
  templateUrl: './test-case-change-request-manager.component.html',
  styleUrls: ['./test-case-change-request-manager.component.css']
})
export class TestCaseChangeRequestManagerComponent implements OnChanges, OnDestroy {

  @Input() testCaseChangeRequest: TestCaseChangeRequest;
  @Output() treatedRequestId = new EventEmitter();

  destroy$ = new Subject<void>();

  testCaseChanges: TestCaseChanges;
  testCaseLibrary: any;
  savedTestCaseChanges: TestCaseChanges;
  savedTestCaseLibrary: any;
  testStepChanges: TestStep[];
  testStepLibrary: TestStepLibrary[];
  savedTestStepLibrary: TestStepLibrary[];
  testStepsObject: any[];

  indexInput: number;
  testCaseLibraryUpdated: boolean;

  inputDescriptionFlag: string;
  inputCategoryFlag: string;
  inputExecutionEstimationTimeFlag: string;
  inputPreConditionFlag: string;

  focusedField = '';
  libraryInputDescriptionFocused = true;
  libraryInputCategoryFocused = true;
  libraryInputExecutionEstimationTimeFocused = true;
  libraryInputPreConditionFocused = true;
  showLibraryCategoryDropdown = false;

  testInputDescriptionFocused = true;
  testInputCategoryFocused = true;
  testInputExecutionEstimationTimeFocused = true;
  testInputPreConditionFocused = true;

  showTestCategoryDropdown = false;

  showStatusDropdown = false;
  listStatus = DropDownListValues.listStatus;
  testCaseCategories = DropDownListValues.testCaseCategories;
  testCaseVersion: number;

  constructor(public globals: Globals,
    private testCaseChangesService: TestCaseChangesService,
    private testCaseLibraryService: TestCaseLibraryService,
    private testCaseChangeRequestService: TestCaseChangeRequestService,
    private spinner: NgxSpinnerService,
    private testStepLibraryServices: TestStepLibraryServices,
    private confirmationDialogService: ConfirmationDialogService,
    private testStepChangesService: TestStepChangesService,
    private toastr: ToastrService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes?.testCaseChangeRequest) {
      if (changes.testCaseChangeRequest.currentValue != undefined) {
        this.testCaseChangeRequest = changes.testCaseChangeRequest.currentValue;
        this.resetComponentVariables();
        this.fetchTestCaseData();
        this.testCaseLibraryUpdated = false;
      }
    }
  }

  private resetComponentVariables() {
    this.focusedField = '';

    this.testStepsObject = []

    this.libraryInputDescriptionFocused = true;
    this.libraryInputCategoryFocused = true;
    this.libraryInputExecutionEstimationTimeFocused = true;
    this.libraryInputPreConditionFocused = true;
    this.showLibraryCategoryDropdown = false;
    this.testInputDescriptionFocused = true;
    this.testInputCategoryFocused = true;
    this.testInputExecutionEstimationTimeFocused = true;
    this.testInputPreConditionFocused = true;
    this.showTestCategoryDropdown = false;
  }

  private fetchTestCaseData(): void {
    const testCaseId = this.testCaseChangeRequest.testCaseId;
    forkJoin([
      this.testCaseChangesService.getTestCaseChangesByTestCaseChangeRequestId(this.testCaseChangeRequest.id).pipe(takeUntil(this.destroy$)),
      this.testCaseLibraryService.getTestCaseLibraryById(testCaseId).pipe(takeUntil(this.destroy$))
    ]).subscribe(([testCaseChanges, testCaseLibrary]) => {
      this.testCaseChanges = testCaseChanges;
      this.savedTestCaseChanges = _.cloneDeep(this.testCaseChanges);
      this.testStepChanges = this.testCaseChanges.testStepChanges?.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
      this.testCaseLibrary = testCaseLibrary;
      this.testCaseVersion =  this.testCaseLibrary.testCaseVersion;
      this.savedTestCaseLibrary = _.cloneDeep(this.testCaseLibrary);
      this.testStepLibrary = this.testCaseLibrary.testStepsLibrary?.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
      this.updateFlags();
      this.getChangedTestStepLibrary();
    });
  }

  private getChangedTestStepLibrary() {
    const maxLength = Math.max(this.testStepLibrary?.length, this.testStepChanges?.length);
    let i = 0;
    let j = 0;
    let stepObject: any;
    let libraryStep: TestStepLibrary;
    let changesStep: TestStep;

    while (i <= maxLength && j <= maxLength) {
      libraryStep = this.testStepLibrary[i];
      changesStep = this.testStepChanges[j];
      stepObject = {
        libraryTestStep: new TestStepLibrary(),
        changesTestStep: new TestStep(),
        stepDescriptionStatus: '',
        expectedResultStatus: '',
        inputTestStepFocused: true,
        inputTestStepExpectedResultFocused: true
      };
      if (changesStep == undefined && libraryStep == undefined) {
        break;
      } else if (changesStep != undefined) {
        if (changesStep.testStepLibraryId == null) {
          //newly added
          stepObject.libraryTestStep = new TestStepLibrary();
          stepObject.changesTestStep = changesStep;
          stepObject.stepDescriptionStatus = 'added';
          stepObject.expectedResultStatus = 'added';
          j++;
        } else if (changesStep.testStepLibraryId != libraryStep.id) {
          //deleted
          stepObject.libraryTestStep = libraryStep;
          stepObject.changesTestStep = new TestStep();
          stepObject.stepDescriptionStatus = 'deleted';
          stepObject.expectedResultStatus = 'deleted';
          i++;
        } else if (changesStep.testStepLibraryId === libraryStep.id) {
          stepObject.libraryTestStep = libraryStep;
          stepObject.changesTestStep = changesStep;
          if (changesStep.stepDescription !== libraryStep.stepDescription) {
            //changed
            stepObject.stepDescriptionStatus = 'changed';
          } else {
            //unchanged
            stepObject.stepDescriptionStatus = 'unchanged';
          }
          if (changesStep.expectedResult !== libraryStep.expectedResult) {
            //changed
            stepObject.expectedResultStatus = 'changed';
          } else {
            //unchanged
            stepObject.expectedResultStatus = 'unchanged';
          }

          i++;
          j++;
        }

      } else if (libraryStep != undefined) {
        //deleted
        stepObject.libraryTestStep = libraryStep;
        stepObject.changesTestStep = new TestStep();
        stepObject.stepDescriptionStatus = 'deleted';
        stepObject.expectedResultStatus = 'deleted';
        i++;
      }
      this.testStepsObject.push(stepObject);
    }
  }

  public saveTestStepLibraryChanges(testStepLibrary: TestStep, inputName: string, index: number, event): void {
    event.stopPropagation();
    const updatedChangedTestStep = { ...this.testStepsObject[index].changesTestStep };
    switch (inputName) {
      case 'expectedResult':
        this.testStepsObject[index].libraryTestStep.expectedResult = testStepLibrary.expectedResult;
        updatedChangedTestStep.expectedResult = testStepLibrary.expectedResult;
        if (this.testStepsObject[index].libraryTestStep.expectedResult === this.testStepsObject[index].changesTestStep.expectedResult) {
          this.testStepsObject[index].expectedResultStatus = 'unchanged';
        } else {
          this.testStepsObject[index].expectedResultStatus = 'treated';
        }
        this.testStepsObject[index].inputTestStepExpectedResultFocused = true;
        break;
      case 'stepDescription':
        this.testStepsObject[index].libraryTestStep.stepDescription = testStepLibrary.stepDescription;
        updatedChangedTestStep.stepDescription = testStepLibrary.stepDescription;
        if (this.testStepsObject[index].libraryTestStep.stepDescription === this.testStepsObject[index].changesTestStep.stepDescription) {
          this.testStepsObject[index].stepDescriptionStatus = 'unchanged';
        } else {
          this.testStepsObject[index].stepDescriptionStatus = 'treated';
        }
        this.testStepsObject[index].inputTestStepFocused = true;
        break;
    }
    this.updateTestStepLibrary(this.testStepsObject[index].libraryTestStep);
    this.updateTestStepChanges(updatedChangedTestStep);

  }

  public ignoreTestStepsChanges(index: number) {
    this.testStepsObject[index].inputTestStepExpectedResultFocused = true;
    this.testStepsObject[index].inputTestStepFocused = true;
    switch (this.testStepsObject[index].stepDescriptionStatus) {
      case 'added':
        this.deleteTestStepChanges(this.testStepsObject[index].changesTestStep, index);
        this.testStepsObject[index].stepDescriptionStatus = 'removed';
        this.testStepsObject[index].expectedResultStatus = 'removed';

        break;
      case 'deleted':
        this.testStepsObject[index].changesTestStep.expectedResult = this.testStepsObject[index].libraryTestStep.expectedResult;
        this.testStepsObject[index].changesTestStep.stepDescription = this.testStepsObject[index].libraryTestStep.stepDescription;
        this.testStepsObject[index].changesTestStep.testStepLibraryId = this.testStepsObject[index].libraryTestStep.id;
        this.testStepsObject[index].changesTestStep.testCaseLibraryId = this.testStepsObject[index].libraryTestStep.testCaseLibraryId;
        this.testStepsObject[index].changesTestStep.testId = this.testCaseChangeRequest.testId;
        this.testStepsObject[index].changesTestStep.stepOrder = this.testStepsObject[index].libraryTestStep.stepOrder;
        this.testStepsObject[index].changesTestStep.testCaseChangeRequestId = this.testCaseChangeRequest.id;
        this.addTestStepChanges(this.testStepsObject[index].changesTestStep, index);
        this.testStepsObject[index].stepDescriptionStatus = 'unchanged';
        this.testStepsObject[index].expectedResultStatus = 'unchanged';
        break;
      case 'changed':
        this.testStepsObject[index].changesTestStep.expectedResult = this.testStepsObject[index].libraryTestStep.expectedResult;
        this.testStepsObject[index].changesTestStep.stepDescription = this.testStepsObject[index].libraryTestStep.stepDescription;
        this.updateTestStepChanges(this.testStepsObject[index].changesTestStep);
        this.testStepsObject[index].stepDescriptionStatus = 'treated';
        this.testStepsObject[index].expectedResultStatus = 'treated';
        break;
      case 'unchanged':
        if (this.testStepsObject[index].expectedResultStatus === 'changed') {
          this.testStepsObject[index].changesTestStep.expectedResult = this.testStepsObject[index].libraryTestStep.expectedResult;
          this.testStepsObject[index].changesTestStep.stepDescription = this.testStepsObject[index].libraryTestStep.stepDescription;
          this.updateTestStepChanges(this.testStepsObject[index].changesTestStep);
          this.testStepsObject[index].stepDescriptionStatus = 'treated';
          this.testStepsObject[index].expectedResultStatus = 'treated';
        }
        break;
    }
  }

  public acceptTestStepsChanges(index: number) {
    const status = this.testStepsObject[index].stepDescriptionStatus;
    switch (status) {
      case 'deleted':
        this.deleteTestStepLibrary(this.testStepsObject[index].libraryTestStep, index);
        this.testStepsObject[index].stepDescriptionStatus = 'removed';
        this.testStepsObject[index].expectedResultStatus = 'removed';
        break;
      case 'added':
        this.testStepsObject[index].stepDescriptionStatus = 'unchanged';
        this.testStepsObject[index].expectedResultStatus = 'unchanged';
        this.testStepsObject[index].libraryTestStep.expectedResult = this.testStepsObject[index].changesTestStep.expectedResult;
        this.testStepsObject[index].libraryTestStep.stepDescription = this.testStepsObject[index].changesTestStep.stepDescription;
        this.addTestStepLibrary(this.testStepsObject[index].libraryTestStep, index);
        break;
      case 'changed':
        this.testStepsObject[index].stepDescriptionStatus = 'unchanged';
        this.testStepsObject[index].expectedResultStatus = 'unchanged';
        this.testStepsObject[index].libraryTestStep.expectedResult = this.testStepsObject[index].changesTestStep.expectedResult;
        this.testStepsObject[index].libraryTestStep.stepDescription = this.testStepsObject[index].changesTestStep.stepDescription;
        this.updateTestStepLibrary(this.testStepsObject[index].libraryTestStep);
        break;
      case 'unchanged':
        if (this.testStepsObject[index].expectedResultStatus === 'changed') {
          this.testStepsObject[index].stepDescriptionStatus = 'unchanged';
          this.testStepsObject[index].expectedResultStatus = 'unchanged';
          this.testStepsObject[index].libraryTestStep.expectedResult = this.testStepsObject[index].changesTestStep.expectedResult;
          this.testStepsObject[index].libraryTestStep.stepDescription = this.testStepsObject[index].changesTestStep.stepDescription;
          this.updateTestStepLibrary(this.testStepsObject[index].libraryTestStep);
        }
        break;
    }
    this.testStepsObject[index].inputTestStepExpectedResultFocused = true;
    this.testStepsObject[index].inputTestStepFocused = true;

  }

  private async deleteTestStepLibrary(testStepLibrary: TestStepLibrary, index: number): Promise<void> {
    const confirmed = await this.confirmationDialogService.confirm(
      'Delete Test Step',
      'Test step will be deleted from library. Could you please confirm with OK?'
    );

    if (!confirmed) {
      return;
    }

    if (testStepLibrary.id !== undefined) {
      this.testStepLibraryServices.deleteTestStepLibrary(testStepLibrary.id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.spinner.hide())
        )
        .subscribe((deleteTestStepLibraryResponse) => {
          this.toastr.success('Test step has been successfully deleted ');
          this.reorderTestStepLibrary(index, 0)
        });
    }
  }

  private updateTestStepChanges(savedTestStepChanges: TestStep): void {
    this.spinner.show();
    this.testStepChangesService.updateTestStepChanges(savedTestStepChanges)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.spinner.hide())
      )
      .subscribe(updateTestStepChangesResponse => {
        //this.toastr.success('Test step changes updated successfully');
        this.getSavedTestChangesByTestyCaseChangeRequestId(this.testCaseChangeRequest.id);
      }
      );
  }

  private addTestStepLibrary(testStepLibrary: TestStepLibrary, index: number): void {
    testStepLibrary.testCaseLibraryId = this.testCaseChangeRequest.testCaseId;
    testStepLibrary.stepOrder = index + 1;
    this.testStepLibraryServices.addTestStepLibrary(testStepLibrary)
      .subscribe((addedTestStepId) => {
        const id = +JSON.parse(addedTestStepId).message;
        testStepLibrary.id = id;
        this.testStepsObject[index].changesTestStep.testStepLibraryId = id;
        this.testStepsObject[index].libraryTestStep = testStepLibrary;
        this.reorderTestStepLibrary(index, 1);
        this.updateTestStepChanges(this.testStepsObject[index].changesTestStep);
        this.toastr.success('Test step has been successfully created ');
      });
  }

  private reorderTestStepLibrary(startIndex: number, diff: number): void {
    this.testCaseLibraryUpdated = true;
    for (let i = startIndex + 1; i < this.testStepsObject.length; i++) {
      if (this.testStepsObject[i].libraryTestStep.id != null) {
        this.testStepsObject[i].libraryTestStep.stepOrder = i + diff;
        this.updateTestStepLibrary(this.testStepsObject[i].libraryTestStep);
      }
    }
  }

  private addTestStepChanges(savedTestStepChanges: TestStep, index: number): void {
    this.spinner.show();
    this.testStepChangesService.addTestStepChanges(savedTestStepChanges).pipe(takeUntil(this.destroy$)).subscribe(
      addTestStepChangesResponse => {
        this.reorderTestStepChanges(index, 1);
      }
    );
    this.spinner.hide();
  }

  private deleteTestStepChanges(savedTestStepChanges: TestStep, index: number): void {
    this.spinner.show();
    this.testStepChangesService.deleteTestStepChanges(savedTestStepChanges.id).pipe(takeUntil(this.destroy$)).subscribe(
      deleteTestStepChangesResponse => {
        this.reorderTestStepChanges(index, 0);
      }
    );
    this.spinner.hide();
  }

  private reorderTestStepChanges(startIndex: number, diff: number): void {
    for (let i = startIndex + 1; i < this.testStepsObject.length; i++) {
      if (this.testStepsObject[i].changesTestStep.id != null) {
        this.testStepsObject[i].changesTestStep.stepOrder = i + diff;
        this.updateTestStepChanges(this.testStepsObject[i].changesTestStep);
      }
    }

  }

  private updateTestStepLibrary(testStepLibrary) {
    this.testCaseLibraryUpdated = true;
    this.testStepLibraryServices.updateTestStepLibrary(testStepLibrary).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.toastr.success('Test step has been successfully updated ');
        this.getSavedTestCaseLibraryById(testStepLibrary.testCaseLibraryId);
      }
    );
  }
  public resetTestStep(event, inputName: string, index: number) {
    event.stopPropagation();
    const savedTestStepLibrary = this.getSavedTestStepLibraryById(this.testStepsObject[index].libraryTestStep.id);
    if (savedTestStepLibrary) {
      switch (inputName) {
        case 'expectedResult':
          this.testStepsObject[index].libraryTestStep.expectedResult = savedTestStepLibrary.expectedResult;
          this.testStepsObject[index].inputTestStepExpectedResultFocused = true;
          break;
        case 'stepDescription':
          this.testStepsObject[index].libraryTestStep.stepDescription = savedTestStepLibrary.stepDescription;
          this.testStepsObject[index].inputTestStepFocused = true;
          break;
      }
    }
  }

  private getSavedTestCaseLibraryById(id) {
    this.testCaseLibraryService.getTestCaseLibraryById(id).subscribe(
      (testCaseLibrary) => {
        this.savedTestCaseLibrary = testCaseLibrary;
      }
    );
  }

  private getSavedTestStepLibraryById(id: number): TestStepLibrary | undefined {
    return this.savedTestCaseLibrary.testStepsLibrary.find(savedTestStep => savedTestStep.id === id);
  }

  public saveTestCaseLibrary(inputName: string, event?): void {
    if (!event && inputName == "state") {
      this.savedTestCaseLibrary.state = this.testCaseLibrary.state;
      //this.savedTestCaseChanges.state = this.testCaseLibrary.state;
    } else {
      event.stopPropagation();
      switch (inputName) {
        case 'shortDescription':
          this.savedTestCaseLibrary.shortDescription = this.testCaseLibrary.shortDescription;
          this.savedTestCaseChanges.shortDescription = this.testCaseLibrary.shortDescription;
          this.libraryInputDescriptionFocused = true;
          this.inputDescriptionFlag = 'treated';
          break;

        case 'category':
          this.savedTestCaseLibrary.category = this.testCaseLibrary.category;
          this.savedTestCaseChanges.category = this.testCaseLibrary.category;
          this.inputCategoryFlag = 'treated';
          this.libraryInputCategoryFocused = true;
          this.showLibraryCategoryDropdown = false;
          break;

        case 'executionEstimationTime':
          this.savedTestCaseLibrary.executionEstimationTime = this.testCaseLibrary.executionEstimationTime;
          this.savedTestCaseChanges.executionEstimationTime = this.testCaseLibrary.executionEstimationTime;
          this.inputExecutionEstimationTimeFlag = 'treated';
          this.libraryInputExecutionEstimationTimeFocused = true;
          break;

        case 'preCondition':
          this.savedTestCaseLibrary.preCondition = this.testCaseLibrary.preCondition;
          this.savedTestCaseChanges.preCondition = this.testCaseLibrary.preCondition;
          this.inputPreConditionFlag = 'treated';
          this.libraryInputPreConditionFocused = true;
          break;
      }
    }
    this.updateTestCaseLibrary();
    this.updateTestCaseChanges();
  }
  private updateTestCaseLibrary(): void {
    this.testCaseLibraryUpdated = true;
    this.testCaseLibraryService.updateTestCaseLibrary(this.testCaseLibrary.testCaseLibraryId, this.testCaseLibrary).pipe(takeUntil(this.destroy$)).subscribe(
      updateTestCaseLibraryResponse => {
        this.toastr.success('Test case has updated successfully');
        this.getSavedTestCaseLibraryById(this.testCaseLibrary.testCaseLibraryId);
      }
    );
  }

  public acceptChanges(inputName: string, testCaseChangesFieldValue: any) {
    switch (inputName) {
      case 'shortDescription':
        this.testCaseLibrary.shortDescription = testCaseChangesFieldValue;
        this.libraryInputDescriptionFocused = true;
        this.inputDescriptionFlag = 'unchanged';
        break;

      case 'category':
        this.testCaseLibrary.category = testCaseChangesFieldValue;
        this.libraryInputCategoryFocused = true;
        this.inputCategoryFlag = 'unchanged';
        break;

      case 'executionEstimationTime':
        this.testCaseLibrary.executionEstimationTime = testCaseChangesFieldValue;
        this.libraryInputExecutionEstimationTimeFocused = true;
        this.inputExecutionEstimationTimeFlag = 'unchanged';
        break;

      case 'preCondition':
        this.testCaseLibrary.preCondition = testCaseChangesFieldValue;
        this.libraryInputPreConditionFocused = true;
        this.inputPreConditionFlag = 'unchanged';
        break;
    }
    this.updateTestCaseLibrary();
  }

  public ignoreChanges(inputName: string, testCaseLibraryFieldValue: any) {
    switch (inputName) {
      case 'shortDescription':
        this.savedTestCaseChanges.shortDescription = testCaseLibraryFieldValue;
        this.testInputDescriptionFocused = false;
        this.inputDescriptionFlag = 'treated';
        break;

      case 'category':
        this.savedTestCaseChanges.category = testCaseLibraryFieldValue;
        this.testInputCategoryFocused = false;
        this.inputCategoryFlag = 'treated';
        break;

      case 'executionEstimationTime':
        this.savedTestCaseChanges.executionEstimationTime = testCaseLibraryFieldValue;
        this.testInputExecutionEstimationTimeFocused = false;
        this.inputExecutionEstimationTimeFlag = 'treated';
        break;

      case 'preCondition':
        this.savedTestCaseChanges.preCondition = testCaseLibraryFieldValue;
        this.testInputPreConditionFocused = false;
        this.inputPreConditionFlag = 'treated';
        break;
    }
    this.updateTestCaseLibrary();
    this.updateTestCaseChanges();
  }

  public resetLibrary(event, inputName: string) {
    event.stopPropagation(); switch (inputName) {
      case 'shortDescription':
        this.testCaseLibrary.shortDescription = this.savedTestCaseLibrary.shortDescription;
        this.libraryInputDescriptionFocused = true;
        break;
      case 'category':
        this.testCaseLibrary.category = this.savedTestCaseLibrary.category;
        this.libraryInputCategoryFocused = true;
        break;
      case 'executionEstimationTime':
        this.testCaseLibrary.executionEstimationTime = this.savedTestCaseLibrary.executionEstimationTime;
        this.libraryInputExecutionEstimationTimeFocused = true;
        break;
      case 'preCondition':
        this.testCaseLibrary.preCondition = this.savedTestCaseLibrary.preCondition;
        this.libraryInputPreConditionFocused = true;
        break;
    }
  }

  public async done(): Promise<void> {
    const confirmed = await this.confirmationDialogService.confirm(
      'Close Change Request',
      `All Changes check is finished. This action cannot be undone.<br />Could you please confirm ?`,
      { enableMessageHtml: true }
    );
    if (confirmed && this.testCaseChanges.testCaseChangeRequestId) {
      this.spinner.show();
      this.testCaseChangeRequestService.treatTestCaseChangeRequest('DONE', this.testCaseChanges.testCaseChangeRequestId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.spinner.hide())
        )
        .subscribe(() => {
          this.toastr.success('Test case Change request has been successfully done');
          this.treatedRequestId.emit(this.testCaseChanges.testCaseChangeRequestId);
        }
        );
    }
  }

  public async acceptAll(): Promise<void> {
    const confirmed = await this.confirmationDialogService.confirm(
      'Accept All Changes ',
      `All Changes will be accepted. This action cannot be undone.<br />Could you please confirm ?`,
      { enableMessageHtml: true }
    );
    if (confirmed && this.testCaseChanges.testCaseChangeRequestId) {
      this.spinner.show();
      this.testCaseChangeRequestService.treatTestCaseChangeRequest('ACCEPT_ALL', this.testCaseChanges.testCaseChangeRequestId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.spinner.hide())
        )
        .subscribe(() => {
          this.toastr.success('Test case Change request has been successfully accepted');
          this.treatedRequestId.emit(this.testCaseChanges.testCaseChangeRequestId);
        }
        );
    }
  }

  public async rejectAll(): Promise<void> {
    const confirmed = await this.confirmationDialogService.confirm(
      'Reject Change Request',
      `All Changes will be ignored. This action cannot be undone.<br />Could you please confirm ?`,
      { enableMessageHtml: true }
    );
    if (confirmed && this.testCaseChanges.testCaseChangeRequestId) {
      this.spinner.show();
      this.testCaseChangeRequestService.treatTestCaseChangeRequest('REJECT_ALL', this.testCaseChanges.testCaseChangeRequestId)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.spinner.hide())
        )
        .subscribe(() => {
          this.toastr.success('Test case Change request has been successfully rejected');
          this.treatedRequestId.emit(this.testCaseChanges.testCaseChangeRequestId);
        }
        );
    }
  }

  private updateTestCaseChanges(testCase?): void {
    this.spinner.show();
    this.testCaseChangesService.updateTestCaseChanges(this.savedTestCaseChanges)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.spinner.hide())
      ).subscribe(
        updateTestCaseChangesResponse => {
          this.loadTestCaseLibraryById(this.savedTestCaseChanges.testCaseLibraryId);
          //this.toastr.success('Test case changes updated successfully');
          this.getSavedTestChangesByTestyCaseChangeRequestId(this.savedTestCaseChanges.id);
        }
      );
    this.spinner.hide();
  }
  private getSavedTestChangesByTestyCaseChangeRequestId(id) {
    this.testCaseChangesService.getTestCaseChangesByTestCaseChangeRequestId(this.testCaseChangeRequest.id)
      .pipe(takeUntil(this.destroy$)).subscribe(
        testCaseChanges => {
          this.savedTestCaseChanges = testCaseChanges;
        },
        err => { console.log(err); }
      );
  }


  //css functions
  private updateFlags() {
    if (this.savedTestCaseChanges.shortDescription !== this.savedTestCaseLibrary.shortDescription) {
      this.inputDescriptionFlag = 'changed';
    } else {
      this.inputDescriptionFlag = 'unchanged';
    }
    if (this.savedTestCaseChanges.category !== this.savedTestCaseLibrary.category) {
      this.inputCategoryFlag = 'changed';
    } else {
      this.inputCategoryFlag = 'unchanged';
    }
    if (+this.savedTestCaseChanges.executionEstimationTime !== +this.savedTestCaseLibrary.executionEstimationTime) {
      this.inputExecutionEstimationTimeFlag = 'changed';
    } else {
      this.inputExecutionEstimationTimeFlag = 'unchanged';
    }
    if (this.savedTestCaseChanges.preCondition !== this.savedTestCaseLibrary.preCondition) {
      this.inputPreConditionFlag = 'changed';
    } else {
      this.inputPreConditionFlag = 'unchanged';
    }
  }

  public fieldLibraryFocus(event, nameInput) {
    event.target.parentNode.classList.add('focused');

    switch (nameInput) {
      case 'shortDescription':
        this.libraryInputDescriptionFocused = false;
        break;

      case 'category':
        this.libraryInputCategoryFocused = false;
        break;

      case 'executionEstimationTime':
        this.libraryInputExecutionEstimationTimeFocused = false;
        break;

      case 'preCondition':
        this.libraryInputPreConditionFocused = false;
        break;

      default:
        break;
    }
  }

  public fieldStepFocus(event, nameInput: string, index: number) {
    event.target.parentNode.classList.add('focused');
    nameInput === 'stepDescription'
      ? (this.testStepsObject[index].inputTestStepFocused = false)
      : (this.testStepsObject[index].inputTestStepExpectedResultFocused = false);
  }

  public fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
    this.focusedField = '';
  }

  public toggleLibraryCategoryDropdown() {
    this.showLibraryCategoryDropdown = !this.showLibraryCategoryDropdown;
  }

  public selectCategory(testCase: any, category: string) {
    testCase.category = category;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }
  public selectState(state: string, id: number, testCase: TestCaseLibrary) {
    if (this.savedTestCaseLibrary.state != state) {
      this.testCaseLibrary.state = state;

      this.testCaseLibrary.productId = + this.globals.getProductId();
      if (state === 'APPROVED') {
        //  this.newTestCaseArchived = true;
      }
      this.updateTestCaseChanges(this.testCaseLibrary);
      this.saveTestCaseLibrary('state');
      this.showStatusDropdown = false;

    }
  }

  private loadTestCaseLibraryById(testCaseId: number): void {
    this.testCaseLibraryService.getTestCaseLibraryById(testCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
          this.testCaseLibrary = data;
         this.testCaseVersion= this.testCaseLibrary.testCaseVersion;
        }
      );
  }

}
