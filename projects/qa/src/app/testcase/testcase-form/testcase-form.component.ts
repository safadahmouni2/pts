import { Component, EventEmitter, Input, OnChanges, Output, OnDestroy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { TestStep } from '../../models/TestStep';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TestCaseLibrary } from '../../models/test-case-library';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import TestStepLibrary from '../../models/TestStepLibrary';
import { TestStepLibraryServices } from '../../services/TestStepLibraryServices';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from '../../config/globals';
import { Subscription, Subject } from 'rxjs';
import { TestCaseInput } from '../../models/TestCaseInput';
import {finalize, takeUntil} from 'rxjs/operators';
import { UsTestCaseServices } from '../../services/usTestCaseServices';
import { UsTestCase } from '../../models/UsTestCase';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { DocumentTestCaseLibraryService } from '../../services/documentTestCaseLibraryService';
import { saveAs } from 'file-saver';
import {SourceSystem} from "../../models/SourceSystem";
import { LibraryTestCaseEffortService } from '../../services/libraryTestCaseEffortService';
import {DropDownListValues} from "../../models/DropDownListValues";
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment';
import 'moment-duration-format';

@Component({
  selector: 'app-testcase-form',
  templateUrl: './testcase-form.component.html',
  styleUrls: ['./testcase-form.component.css']
})
export class TestcaseFormComponent implements OnChanges, OnDestroy{
  @Input() testCaseSelected: any;
  @Input() libraryTestCaseEffort: any;
  @Output() sendRequestToParent = new EventEmitter();
  @Output() sendRequestUsDetails = new EventEmitter();
  @Output() startRunning = new EventEmitter();
  @Output() initCounter = new EventEmitter();
  @Output() requestRefreshLibraryList = new EventEmitter();
  @Input() userStoryId:any

  listStatus = DropDownListValues.listStatus;
  testCaseCategories = DropDownListValues.testCaseCategories;

  newTestCaseArchived: boolean;
  selectedTab: 'TestExecution';
  showCategoryDropdown = false;
  showStatusDropdown = false;
  testCaseId: number;
  testCaseVersion: number;
  testStepsLibrary: TestStepLibrary[];
  savedTestStepsLibrary: TestStepLibrary[];
  testSteps: TestStep[];
  destroy$ = new Subject<void>();
  testCaseLibrary: TestCaseLibrary;
  testCaseOld: UsTestCase;
  inputDescriptionFocused = true;
  inputCategoryFocused = true;
  inputExecutionEstimationTimeFocused = true;
  inputEffortFocused = true;
  inputPreConditionFocused = true;
  inputTestStepFocused = true;
  inputExpectedResultFocused = true;
  inputDocShortDescription: any;
  inputStateFocused = true;
  testCaseAttached: UsTestCase;
  AttachedTestCase = false;
  modalRef: BsModalRef;
  testCaseLoaded = false;
  testCaseExists;
  router: Router;
  lastSelectedCategory;
  clickEventSubscription: Subscription;
  isStatusApproved = false;
  status: string;
  user: any;
  userCode: any;
  headers = new HttpHeaders();
  isTestStepDescriptionDirty = [];
  isTestStepExpectedResultDirty = [];
  indexInput: number;
  selectInput: string;
  showDropDown = true;
  chatUrl: string;
  isProd = environment.production;
  documentList: any = [];
  selectedFile: File;
  onUploading = false;
  startDateTime: Date;
  endDateTime: Date;
  hr: any = '0' + 0;
  min: any = '0' + 0;
  sec: any = '0' + 0;
  ms: any = '0' + 0;
  estimatedEffort: any;
  counterStarted =false;

  startCounter: any;
  running :any;
  effortObject:any;
  libraryTestCaseEffortList:any;
  totalEffort:any;
  lastEffort:any;
  lastTestCase:any;
  lastTestStepLibrary:any
  savedTCInLibrary:TestCaseLibrary;
  testCaseToUpdate:TestCaseLibrary;

  constructor(
    private activatedRoute: ActivatedRoute,
    private testCaseLibraryService: TestCaseLibraryService,
    private testStepLibraryServices: TestStepLibraryServices,
    private testCaseServicesOld: UsTestCaseServices,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private confirmationDialogService: ConfirmationDialogService,
    private documentTestCaseLibraryService: DocumentTestCaseLibraryService,
    private cdRef: ChangeDetectorRef,
    private libraryTestCaseEffortService :LibraryTestCaseEffortService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.testCaseSelected && this.testCaseSelected && (!changes.testCaseSelected.previousValue||(changes.testCaseSelected.currentValue.testCaseLibraryId !== changes.testCaseSelected.previousValue.testCaseLibraryId))) {
      // this.reset();
      this.lastTestCase = this.testCaseSelected;
      this.lastTestStepLibrary = this.testCaseSelected.testStepsLibrary; 
     this.testSteps = this.testCaseSelected.testStepsLibrary != null ? this.testCaseSelected.testStepsLibrary : [];
     this.getAllLibraryTestCaseEffortByLibraryTestCaseId(this.testCaseSelected.testCaseLibraryId,true)

    this.initiateComponent();
    this.getDocumentsByTest();
    }
    if(changes.libraryTestCaseEffort && changes.libraryTestCaseEffort.currentValue && !changes.libraryTestCaseEffort.currentValue.id){

    this.libraryTestCaseEffortService.addLibraryTestCaseEffort(this.libraryTestCaseEffort).subscribe(
      addTestEffortResponse => {
        this.libraryTestCaseEffort.id = JSON.parse(addTestEffortResponse).message;
         this.getAllLibraryTestCaseEffortByLibraryTestCaseId(this.libraryTestCaseEffort.testCaseLibraryId,false)
        this.running  = true;
      });
    }
    this.selectedFile = null;
    this.chatUrl = this.globals.getChatUrl(this.testCaseId, 'library_test_case');
    this.newTestCaseArchived = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
    this.reset();
  }

  private initiateComponent() {

           this.testCaseId = this.testCaseSelected.testCaseLibraryId;
          if (this.testCaseSelected) {
            this.testStepLibraryServices.getTestStepsLibraryByTestCaseLibraryId(this.testCaseSelected.testCaseLibraryId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {
                if (data) {
                  this.savedTestStepsLibrary = data.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
                  this.testStepsLibrary = this.savedTestStepsLibrary;
                  this.isTestStepDescriptionDirty.length = this.testStepsLibrary.length
                  this.isTestStepExpectedResultDirty.length = this.testStepsLibrary.length;
                }
              });

            this.testCaseVersion = this.testCaseSelected.testCaseVersion;
            this.status = this.testCaseSelected.state;
            this.lastSelectedCategory = this.testCaseSelected.category;
            // check the status of test case
            this.isAttachButtonEnabled(this.status);
          }
          this.verifyTestCasExists();

    // subscribe to detect Unassigned TC click from user story view then refresh edit view of test case
    this.clickEventSubscription = this.sharedService.getClickEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // call of initiateComponent/ngOnInit function to load and refresh the edit view of test case
        this.initiateComponent();
      });

    // subscribe to detect Unassigned TC click from user story view then refresh edit view of test case
    this.clickEventSubscription = this.sharedService.getAttachEventState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // call of initiateComponent/ngOninit function to load and refresh the edit view of test case
        this.initiateComponent();
      });
  }

  private verifyTestCasExists() {
    this.testCaseServicesOld.getUsTestCaseByTestCaseLibraryIdAndUserStoryId(
      this.testCaseSelected.testCaseLibraryId, this.userStoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.testCaseExists = data ? true : false;
        this.testCaseLoaded = true;
      }
      );
  }

  private isAttachedTestCase(testCaseId: number) {
    this.testCaseServicesOld.getTestCaseById(testCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.testCaseAttached = data;
      }
      );


  }

  /**
   * attachTestCase : attach test case to user story
   */
  public attachTestCase(testCaseId: number) {
    this.spinner.show();
    // set testCase
    const testCaseNew: TestCaseInput = new TestCaseInput();
    if (testCaseId) {
      let tcIdL;
      if (Number(testCaseId)) {
        tcIdL = testCaseId;
      }
      testCaseNew.testCaseLibraryId = parseInt(tcIdL, 10);
    }
    testCaseNew.userStoryId = this.userStoryId;
    if (this.globals.getSprintId()) {
      let tcId;
      if (Number(this.globals.getSprintId())) {
        tcId = this.globals.getSprintId();
      }
      testCaseNew.sprintId = parseInt(tcId, 10);
    }
    // add testCase
    this.testCaseServicesOld.copyTestCase(testCaseNew)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.verifyTestCasExists();
        // refresh test case list under US
        this.sharedService.sendClickEvent();
        this.sharedService.sendAttachEventState();
        this.toastr.success('Test case successfully attached to the user story');
      }
      );
    this.spinner.hide();
  }

  public fieldFocus(event, nameInput, index) {
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
    if (nameInput === 'effort') {
      this.inputEffortFocused = false;
    }
    if (nameInput === 'preCondition') {
      this.inputPreConditionFocused = false;
    }
    if (nameInput === 'testStepDescription') {
      this.inputTestStepFocused = false;
    }
    if (nameInput === 'testStepExpectedResult') {
      this.inputExpectedResultFocused = false;
    } if (nameInput === this.getInputDocShortDescription('docShortDescription', index)) {
      this.inputDocShortDescription = this.getInputDocShortDescription('docShortDescription', index);
    }
  }

  public selectInputStep(test: TestStepLibrary, select: string): void {
    this.selectInput = select;
    this.indexInput = this.testStepsLibrary.findIndex(val => val.id === test.id);
  }

  public fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }

  public toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }
  public toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  public updateTestCase(testCase: TestCaseLibrary,fieldToUpdated? ,event=null,id?): void  {
    if((this.hr === '0' + 0 )&& (this.min=== '0' + 0 )&& (this.sec === '0' + 0 )&& (this.ms === '0' + 0) )
    {
    this.startEffortCounter()
    const startRunningObject = Object.assign({startRunning:true})
    this.startRunning.emit(startRunningObject);
    }

     const sourceSystem = new SourceSystem();
     sourceSystem.sourceSystemName="PTS_QA";
     testCase.sourceSystem =sourceSystem;


    this.testCaseLibraryService.getTestCaseLibraryById(testCase.testCaseLibraryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.savedTCInLibrary = data;
        this.testCaseToUpdate = this.lastTestCase;
        let clonedTC:TestCaseLibrary = cloneDeep(this.savedTCInLibrary);
        if (fieldToUpdated && this.lastTestCase) {
          switch (fieldToUpdated) {
            case'shortDescription':
              this.testCaseToUpdate.shortDescription = testCase.shortDescription;
              this.testCaseToUpdate.preCondition = clonedTC.preCondition;
              this.testCaseToUpdate.category = clonedTC.category;
              this.testCaseToUpdate.executionEstimationTime = clonedTC.executionEstimationTime;
              this.inputDescriptionFocused = true;
            break;
            case'preCondition' :
              this.testCaseToUpdate.preCondition = testCase.preCondition;
              this.testCaseToUpdate.shortDescription = clonedTC.shortDescription;
              this.testCaseToUpdate.executionEstimationTime =clonedTC.executionEstimationTime;
              this.testCaseToUpdate.category = clonedTC.category;
              this.inputPreConditionFocused = true;
            break;
            case'executionEstimationTime':
              this.testCaseToUpdate.executionEstimationTime = testCase.executionEstimationTime;
              this.testCaseToUpdate.preCondition = clonedTC.preCondition;
              this.testCaseToUpdate.category = clonedTC.category;
              this.testCaseToUpdate.shortDescription = clonedTC.shortDescription;
              // hide update and reset buttons in edit form after click update
              this.inputExecutionEstimationTimeFocused = true;
            break;
            case'CATEGORY':
              this.testCaseToUpdate.category = testCase.category;
              this.testCaseToUpdate.executionEstimationTime = clonedTC.executionEstimationTime;
              this.testCaseToUpdate.preCondition = clonedTC.preCondition;
              this.testCaseToUpdate.shortDescription = clonedTC.shortDescription;
              this.inputCategoryFocused = true;
              this.showCategoryDropdown = false;
            break;
          }
          if (event) {
            if (testCase.state === 'APPROVED') {
              this.testCaseToUpdate.state = 'TO_BE_APPROVED';
            }
            event.stopPropagation();
          }
        // show spinner
        this.spinner.show();
        this.testCaseLibraryService.updateTestCaseLibrary( this.testCaseToUpdate.testCaseLibraryId, this.testCaseToUpdate)
              .pipe(finalize(() => this.spinner.hide()),takeUntil(this.destroy$))
              .subscribe(data => {
                this.toastr.success('Test case updated successfully');
                this.requestRefreshLibraryList.emit(testCase);
                //this.loadTestCaseLibraryById(id);
                this.newTestCaseArchived = false;
              },   error => { console.log('An error was occurred.');
                this.spinner.hide();
              });
        }
      });
    // hide update and reset buttons in edit form after click update
    this.inputEffortFocused = true;
    this.inputStateFocused = true;
    this.showStatusDropdown = false;
    this.inputDocShortDescription = "";
    // check the status of test case
    this.isAttachButtonEnabled(testCase.state);
    // hide spinner
    this.spinner.hide();

  }


  /**
   * isAttachButtonEnabled : function to enable and disable the attach button depending on the APPROVED state of the TestCaseLibrary
   * @param state : param of type string, the id of the TestCaseLibrary
   */
  private isAttachButtonEnabled(state: string) {
    // verify status test case, if Approved then activate the attach button
    if (state) {
      if (state !== 'APPROVED') {
        this.isStatusApproved = true;
      } else {
        this.isStatusApproved = false;
      }
    }
  }

  public selectCategory(category: string) {
    this.testCaseSelected.category = category;
  }
  public selectState(state: string, id: number, testCase: TestCaseLibrary) {
    if (this.testCaseSelected.state != state) {
      this.testCaseSelected.state = state;
      this.testCaseSelected.productId = + this.globals.getProductId();
      if (state === 'APPROVED') {
        this.newTestCaseArchived = true;
      }
      this.updateTestCase(testCase,id);
      this.showStatusDropdown = false;

    }
  }

  public ResetSelectCategory(event) {
    event.stopPropagation();

    // get old category value
    this.testCaseSelected.category = this.lastSelectedCategory;
    // hide update and reset buttons in edit form after click update
    this.inputCategoryFocused = true;

  }

  public async deleteTestCase(testCaseId: number, userStoryId: number): Promise<void> {
    let oldTestCaseId;
    const confirmed = await this.confirmationDialogService.confirm(
      'Unassign Test Case',
      'Test Case will be unassigned from user story:' + userStoryId + '. Could you please confirm with OK?'
    );
    if (!confirmed) {
      return;
    }
    if (testCaseId !== undefined) {
      this.testCaseServicesOld.getUsTestCaseByTestCaseLibraryIdAndUserStoryId(
        this.testCaseId, this.userStoryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          oldTestCaseId = data.usTestCaseId;

        }
        );
      this.testCaseServicesOld.deleteUsTestCaseByTestCaseLibraryIdAndUserStoryId(
        this.testCaseId, this.userStoryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.sendRequestToParent.emit(
            oldTestCaseId
          );
          this.sendRequestUsDetails.emit(oldTestCaseId);
          // refresh test case list under US
          this.sharedService.sendAttachEventState();
          this.toastr.success('Test case successfully unassigned from the user story:' + userStoryId);
          this.verifyTestCasExists();
        }
        );
    }
  }

  public addFieldTestStep(index: number): void {
    this.inputTestStepFocused = true;
    this.inputExpectedResultFocused = true;
    this.updateStepOrder(index, 2);
    const ts = new TestStepLibrary();
    ts.stepOrder = index + 1;
    this.testStepsLibrary.splice(index, 0, ts);
    this.isTestStepExpectedResultDirty.splice(index, 0, false);
    this.isTestStepDescriptionDirty.splice(index, 0, false);
    this.sendTestStep(ts);
  }

  public addFieldUnderTestStep(index: number): void {
    this.inputTestStepFocused = true;
    this.inputExpectedResultFocused = true;
    const ts = new TestStepLibrary();
    if (this.testStepsLibrary.length > 0) {
      ts.stepOrder = this.testStepsLibrary[this.testStepsLibrary.length - 1].stepOrder + 1;
    } else {
      ts.stepOrder = 1;
    }
    this.testStepsLibrary.splice(index, 0, ts);
    this.isTestStepExpectedResultDirty.splice(index, 0, false);
    this.isTestStepDescriptionDirty.splice(index, 0, false);
    this.sendTestStep(ts);
  }

  public sendTestStepDescription(testStepLibrary: TestStepLibrary, index: number): void {
    if((this.hr === '0' + 0 )&& (this.min=== '0' + 0 )&& (this.sec === '0' + 0 )&& (this.ms === '0' + 0) )
    {
    this.startEffortCounter()
    const startRunningObject = Object.assign({startRunning:true})
    this.startRunning.emit(startRunningObject);
    }
    let testStep: TestStepLibrary;
    if (testStepLibrary.id !== undefined) {
      testStep = this.getSavedTestStepsLibraryById(testStepLibrary.id);
      testStep.stepDescription = this.testStepsLibrary[index].stepDescription;
      this.sendTestStep(testStep);
    } else {
      this.sendTestStep(testStepLibrary);
      this.isTestStepExpectedResultDirty[index] = false;
    }
    this.isTestStepDescriptionDirty[index] = false;
  }

  public sendTestStepExpectedResult(testStepLibrary: TestStepLibrary, index: number): void {
    if((this.hr === '0' + 0 )&& (this.min=== '0' + 0 )&& (this.sec === '0' + 0 )&& (this.ms === '0' + 0) )
    {
    this.startEffortCounter()
    const startRunningObject = Object.assign({startRunning:true})
    this.startRunning.emit(startRunningObject);
    }
    let testStep: TestStepLibrary;
    if (testStepLibrary.id !== undefined) {
      testStep = this.getSavedTestStepsLibraryById(testStepLibrary.id);
      testStep.expectedResult = this.testStepsLibrary[index].expectedResult;
      this.sendTestStep(testStep);
    } else {
      this.sendTestStep(testStepLibrary);
      this.isTestStepDescriptionDirty[index] = false;
    }
    this.isTestStepExpectedResultDirty[index] = false;
  }

  sendTestStep(testStepLibrary: TestStepLibrary): void {
    if (testStepLibrary.testCaseLibraryId === undefined) {
      this.addTestStepLibrary(testStepLibrary);
    } else {
      this.updateTestStepLibrary(testStepLibrary);
    }
   // this.updateTestCase(this.testCaseId, this.testCaseSelected, event);
  }

  public deleteTestStep(id: number, index: number): void {
    this.confirmationDialogService.confirm('Delete Test Step', 'Test step will be deleted. Could you please confirm with OK?')
      .then((confirmed) => {
        if (confirmed) {
          if (id !== undefined) {
            this.testStepLibraryServices.deleteTestStepLibrary(id)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {
                this.toastr.success('Test step deleted successfully');
                this.getSavedTestStepsLibraryByTestCaseId(this.testCaseId);
              }
              );
          }
          this.updateStepOrder(index, 0);
          this.testStepsLibrary.splice(index, 1);
          this.testSteps.splice(index, 1);
          this.isTestStepDescriptionDirty.splice(index, 1);
          this.isTestStepExpectedResultDirty.splice(index, 1);
        }
      })
  }

  updateStepOrder(startIndex: number, diff: number): void {
    for (let testStepIndex = startIndex; testStepIndex < this.testStepsLibrary.length; testStepIndex++) {
      this.testStepsLibrary[testStepIndex].stepOrder = testStepIndex + diff;
      const testStep = this.getSavedTestStepsLibraryById(this.testStepsLibrary[testStepIndex].id);
      testStep.stepOrder = testStepIndex + diff;
      this.sendTestStep(testStep);
    }
  }


  getSavedTestStepsLibraryByTestCaseId(testCaseId: number): void {
    this.testStepLibraryServices.getTestStepsLibraryByTestCaseLibraryId(testCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.savedTestStepsLibrary = data.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
        }
      }
      );
  }

  private loadTestCaseLibraryById(testCaseId: number): void {
    this.testCaseLibraryService.getTestCaseLibraryById(testCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.testCaseSelected = data
        this.testCaseLibrary = data;
        this.testCaseVersion = data.testCaseVersion;
      }
      );
  }

  getTestCaseById(testCaseId: number): UsTestCase {
    this.testCaseServicesOld.getTestCaseById(testCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.testCaseOld = data;
      }
      );
    return this.testCaseOld;
  }

  addTestStepLibrary(testStepLibrary: TestStepLibrary): void {
    if (this.testCaseId) {
      let tcId;
      if (Number(this.testCaseId)) {
        tcId = this.testCaseId;
      }
      testStepLibrary.testCaseLibraryId = parseInt(tcId, 10);
    }
    testStepLibrary.testCaseLibraryId = this.testCaseId;
    this.testStepLibraryServices.addTestStepLibrary(testStepLibrary)
      .pipe(takeUntil(this.destroy$))
      .subscribe((addTestStepLibraryData) => {
        const id = + JSON.parse(addTestStepLibraryData).message;
        testStepLibrary.id = id;
        this.testStepLibraryServices.getTestStepsLibraryByTestCaseLibraryId(this.testCaseId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((testStepsLibraryData) => {
            this.savedTestStepsLibrary = testStepsLibraryData;
            const savedTestStep = this.getSavedTestStepsLibraryById(id);
            testStepLibrary = savedTestStep;
            this.toastr.success('Test step created successfully');
          });
      }
      );
  }

  updateTestStepLibrary(testStepLibrary: TestStepLibrary): void {
    this.testStepLibraryServices.updateTestStepLibrary(testStepLibrary).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.toastr.success('Test step updated successfully');
        this.getSavedTestStepsLibraryByTestCaseId(this.testCaseId);

      }
    );
  }

  closeDropDown() {
    this.showDropDown = false;

  }

  public onTestStepExpectedResultLineChange(event, index) {
    this.onLineChange(event);
    this.isTestStepExpectedResultDirty[index] = true;
  }

  public onTestStepDescriptionLineChange(event, index) {
    this.onLineChange(event);
    this.isTestStepDescriptionDirty[index] = true;
  }

  public onLineChange(event: any): void {
    const elm = event.target;
    elm.style.height = (elm.scrollHeight + 4) + 'px';
  }

  public onResetStepDescription(testStep: TestStepLibrary, index): void {
    if (testStep.id !== undefined) {
      const savedTestStep =this.lastTestStepLibrary.find((savedTestStep) => savedTestStep.id == testStep.id);
      this.testStepsLibrary[index].stepDescription = savedTestStep.stepDescription;
    } else {
      testStep.stepDescription = null;
    }
    this.isTestStepDescriptionDirty[index] = false;
  }

  public onResetExpectedResult(testStep: TestStepLibrary, index): void {
    if (testStep.id !== undefined) {
      const savedTestStep = this.getSavedTestStepsLibraryById(testStep.id);
      savedTestStep.expectedResult = this.testStepsLibrary[index].expectedResult = savedTestStep.expectedResult;
    } else {
      testStep.expectedResult = null;
    }
    this.isTestStepExpectedResultDirty[index] = false;
  }

  getSavedTestStepsLibraryById(id): TestStepLibrary {
    return this.savedTestStepsLibrary.find((savedTestStep) => {
      return savedTestStep.id == id;
    });
  }

  private getDocumentsByTest() {
    this.documentTestCaseLibraryService.getFilesByTestCaseLibrary(this.testCaseSelected.testCaseLibraryId).pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.documentList = data;
        this.documentList.forEach(doc => {
          if (this.selectedFile && doc.fileName === this.selectedFile.name) {
            this.inputDocShortDescription = this.getInputDocShortDescription('docShortDescription', doc.id);
          }

        });
        this.cdRef.detectChanges();
      })
  }

  onChange(event) {
    this.onUploading = true;
    this.selectedFile = event.target.files[0];
    this.documentTestCaseLibraryService.upload(this.selectedFile, this.testCaseSelected.testCaseLibraryId).pipe(takeUntil(this.destroy$)).subscribe(
      (event: any) => {
        this.getDocumentsByTest();
        this.onUploading = false;
      }
    )

  }
  public updateDocShortDescription(doc) {
    this.inputDocShortDescription = "";
    doc.testCaseLibrary = this.testCaseSelected;
    this.documentTestCaseLibraryService.updateDocTestCaseLibrary(doc.id, doc).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.toastr.success('Test document updated successfully');
    })

  }

  public getInputDocShortDescription(inputDocShortDescription, index) {
    const str = ''
    return str.concat(inputDocShortDescription, index);
  }

  downloadFile(doc: any): void {
    this.documentTestCaseLibraryService
      .download(doc.id).pipe(takeUntil(this.destroy$))
      .subscribe(blob => saveAs(blob, doc.fileName));
  }
  editDoc(doc) {
    this.inputDocShortDescription = this.getInputDocShortDescription('docShortDescription', doc.id);

  }
  deleteDoc(doc) {
    this.documentTestCaseLibraryService.deleteDocumentTestCaseLibrary(doc.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.getDocumentsByTest();
        this.toastr.success('Test document deleted successfully');

      })
  }

  resetChangement() {
    this.inputDocShortDescription = "";
    this.selectedFile = null;
    this.getDocumentsByTest();
  }

  startEffortCounter() {
    let durationEnMs =0;
   if(this.startDateTime){
    this.endDateTime = new Date();
     durationEnMs = Math.max(this.endDateTime.getTime() - this.startDateTime.getTime(), 0);

   }
    this.hr = this.padNumber(Number(this.hr) + Math.floor(durationEnMs / (1000 * 60 * 60)));
    this.min = this.padNumber(Number(this.min) + Math.floor(durationEnMs / (1000 * 60)) % 60);
    this.sec = this.padNumber(Number(this.sec) + Math.floor(durationEnMs / 1000) % 60);

    this.startCounter = setInterval(() => {
      this.ms++;
      this.ms = this.padNumber(Number(this.ms));

      if (this.ms === 100) {
        this.sec++;
        this.sec = this.padNumber(Number(this.sec));
        this.ms = this.padNumber(0);
      }

      if (this.sec === 60) {
        this.min++;
        this.min = this.padNumber(Number(this.min));
        this.sec = this.padNumber(0);
      }

      if (this.min === 60) {
        this.hr++;
        this.hr = this.padNumber(Number(this.hr));
        this.min = this.padNumber(0);
      }
    }, 10);
    this.startDateTime = null;
  }
  padNumber(number) {
    return number < 10 ? '0' + number : number;
  }
  getAllLibraryTestCaseEffortByLibraryTestCaseId(libraryTestCaseId,hasCounter) {
    this.libraryTestCaseEffortService.getLibraryTestCaseEffortListByLibraryTestCaseId(libraryTestCaseId).subscribe(
      data => {
        let lastEffort = []
        this.libraryTestCaseEffortList = data;
        if(hasCounter){
        lastEffort = this.libraryTestCaseEffortList.filter(effort => effort.endTime === null);
        if (lastEffort.length !== 0) {

          this.running = true;
          this.startDateTime = new Date(`${lastEffort[0].date}T${lastEffort[0].startTime}`);
          const startRunningObject=Object.assign({startRunning:true},{startDateTime:this.startDateTime},{id:lastEffort[0].id})
           this.startRunning.emit(startRunningObject);
          this.startEffortCounter();
        }else{
          this.reset();
        }
      }
        this.getTotalEffortByLibraryTestCaseId()
      }
    )
  }
  getTotalEffortByLibraryTestCaseId() {
    this.libraryTestCaseEffortService.getTotalEffortByLibraryTestCaseId(this.testCaseSelected.testCaseLibraryId).subscribe(
      data => {

        var totalEffortOnSec = moment.duration(data, 'seconds').format("hh:mm:ss");

        if (totalEffortOnSec.length === 2) {
          totalEffortOnSec = "00:00:" + totalEffortOnSec;
        } if (totalEffortOnSec.length === 4) {
          totalEffortOnSec = "00:" + totalEffortOnSec
        }
        this.totalEffort = totalEffortOnSec;

      }
    );
  }
reset() {
  clearInterval(this.startCounter);
  this.hr = '0' + 0;
  this.min= '0' + 0;
  this.sec = '0' + 0;
  this.ms = '0' + 0;
}
  resetShortDescription() {
    this.inputDescriptionFocused = true;
    this.testCaseSelected.shortDescription = this.lastTestCase.shortDescription;
  }
  resetExecutionEstimationTime() {
    this.inputExecutionEstimationTimeFocused = true;
    this.testCaseSelected.executionEstimationTime = this.lastTestCase.executionEstimationTime;
  }
  resetPreCondition() {
    this.inputPreConditionFocused = true;
    this.testCaseSelected.preCondition = this.lastTestCase.preCondition
  }
}
